How do you implement client-side streaming timeouts with fallback content using Promise.race and use()?
To prevent a slow network stream from hanging a `<Suspense>` boundary indefinitely, you can race the streaming promise against a client-side timeout promise using **`Promise.race()`** before unwrapping it with **`use()`**.

If the streaming promise fulfills before the timeout, `use()` unwraps the live data. If the timer elapses first, `Promise.race()` returns a fallback payload (or throws a timeout error caught by an Error Boundary).

---

### Step-by-Step Implementation

#### 1. Define the Timeout Race Utility

Create a reusable utility that races an incoming promise against a fallback value after a specified timeout window:

```typescript
// lib/stream-timeout.ts

export async function withStreamTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackValue: T
): Promise<{ data: T; isFallback: boolean }> {
  // Create a timeout promise that resolves with the fallback payload
  const timeoutPromise = new Promise<{ data: T; isFallback: boolean }>((resolve) =>
    setTimeout(() => {
      resolve({ data: fallbackValue, isFallback: true });
    }, timeoutMs)
  );

  // Wrap the real data promise to identify fresh data
  const dataPromise = promise.then((data) => ({
    data,
    isFallback: false,
  }));

  // Promise.race resolves with whichever settles first
  return Promise.race([dataPromise, timeoutPromise]);
}

```

---

#### 2. The Client Component with `use()` and Fallback State

Wrap the raced promise in component state and consume it via `use()`. Provide a manual retry trigger if the fallback was rendered:

```tsx
// app/components/LiveRatesClient.tsx
'use client';

import { use, useState, useTransition } from 'react';
import { withStreamTimeout } from '@/lib/stream-timeout';

export interface RateData {
  currency: string;
  rate: number;
  lastUpdated: string;
}

const STATIC_FALLBACK_RATES: RateData[] = [
  { currency: 'USD/EUR', rate: 0.92, lastUpdated: 'Cached / Static' },
  { currency: 'USD/GBP', rate: 0.78, lastUpdated: 'Cached / Static' },
  { currency: 'USD/JPY', rate: 155.4, lastUpdated: 'Cached / Static' },
];

const TIMEOUT_LIMIT_MS = 4000; // 4 second threshold

export function LiveRatesClient({
  initialStreamPromise,
}: {
  initialStreamPromise: Promise<RateData[]>;
}) {
  const [isPending, startTransition] = useTransition();

  // 1. Race the initial server stream against the fallback timer
  const [racedPromise, setRacedPromise] = useState(() =>
    withStreamTimeout(initialStreamPromise, TIMEOUT_LIMIT_MS, STATIC_FALLBACK_RATES)
  );

  // 2. Unwrap with `use()`. Suspends until either the data resolves or timeout fires
  const { data: rates, isFallback } = use(racedPromise);

  const handleRetry = () => {
    startTransition(() => {
      // Re-fetch and race again
      const freshFetch = fetch('/api/rates').then((res) => res.json());
      setRacedPromise(withStreamTimeout(freshFetch, TIMEOUT_LIMIT_MS, STATIC_FALLBACK_RATES));
    });
  };

  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Exchange Rates</h3>
        {isFallback && (
          <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            Showing Cached Rates (Timeout)
          </span>
        )}
      </div>

      <ul className="divide-y text-sm">
        {rates.map((item) => (
          <li key={item.currency} className="py-2 flex justify-between">
            <span className="font-medium text-gray-700">{item.currency}</span>
            <span className="font-mono text-gray-900">{item.rate}</span>
          </li>
        ))}
      </ul>

      {isFallback && (
        <button
          onClick={handleRetry}
          disabled={isPending}
          className="w-full py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition disabled:opacity-50"
        >
          {isPending ? 'Reconnecting to live stream...' : 'Retry Live Stream'}
        </button>
      )}
    </div>
  );
}

```

---

#### 3. The Server Component Orchestrator

Pass the raw unresolved promise from the server into the client component wrapped in `<Suspense>`:

```tsx
// app/rates/page.tsx (Server Component)
import { Suspense } from 'react';
import { LiveRatesClient } from '@/app/components/LiveRatesClient';
import { fetchLiveRates } from '@/lib/api';

export default function RatesPage() {
  // Fire the stream on the server without awaiting
  const liveRatesPromise = fetchLiveRates();

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Financial Stream</h1>

      <Suspense fallback={<RatesSkeleton />}>
        <LiveRatesClient initialStreamPromise={liveRatesPromise} />
      </Suspense>
    </main>
  );
}

function RatesSkeleton() {
  return (
    <div className="border rounded-lg p-5 bg-gray-50 animate-pulse space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-24 bg-gray-200 rounded w-full" />
    </div>
  );
}

```

---

### Alternative: Timeout that Rejects into an Error Boundary

If no sensible fallback data exists and you prefer to show a dedicated retry UI via an `<ErrorBoundary>`, reject a `TimeoutError` inside the race instead:

```typescript
export async function withStreamTimeoutOrReject<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => {
      reject(new Error(`Stream exceeded timeout threshold of ${timeoutMs}ms`));
    }, timeoutMs)
  );

  return Promise.race([promise, timeoutPromise]);
}

```

When this timeout fires:

1. `Promise.race()` rejects with the `TimeoutError`.
2. `use(racedPromise)` catches the rejection and throws it directly into the nearest enclosing `<ErrorBoundary>`.
3. The Error Boundary displays the error message and provides a transition-based retry button.

---

### Core Best Practices

* **Instantiate the Race in Initial State:** Initialize the `Promise.race` inside a lazy initializer (`useState(() => withStreamTimeout(...))`) or a parent wrapper. Never create a new `Promise.race` directly inside the render body to avoid infinite re-render loops.
* **Keep Fallback Data Lightweight:** Ensure fallback objects are static, pre-calculated, or read synchronously from local cache to prevent the timeout branch from suspending.
* **Transition Retries:** Always wrap re-fetch assignments (`setRacedPromise`) in `startTransition` to keep the current UI responsive and prevent sudden layout shifts while reconnecting.
