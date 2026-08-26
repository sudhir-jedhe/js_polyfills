When streaming data in React 19 (via Server Components, the Flight protocol, or `use(promise)`), **`<Suspense>` handles the loading phase, while `<ErrorBoundary>` catches stream rejections and runtime failures.**

If a streamed Promise rejects after the initial HTML shell has already been sent to the browser, React captures the failure at the nearest enclosing Error Boundary without crashing the rest of the application.

---

### The Dual Boundary Architecture

To handle both in-flight loading and error states for a streamed segment, place the `<ErrorBoundary>` **outside** the `<Suspense>` boundary:

```
┌─────────────────────────────────────────────────────────────┐
│ <ErrorBoundary fallback={<StreamErrorFallback />}>          │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ <Suspense fallback={<StreamSkeleton />}>              │ │
│   │   <StreamedContent dataPromise={dataPromise} />       │ │
│   │ </Suspense>                                           │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

```

* **While streaming (Pending):** `<Suspense>` renders `StreamSkeleton`.
* **When stream fulfills (Success):** `<StreamedContent>` paints in-place.
* **When stream rejects (Error):** The error bubbles past `<Suspense>` and is caught by `<ErrorBoundary>`, swapping the skeleton or component for `StreamErrorFallback`.

---

### Step-by-Step Implementation

#### 1. The Consuming Component (`use()`)

The consumer component unwraps the streamed promise using `use()`. If the promise rejects, `use()` throws the rejected error up the Fiber tree:

```tsx
// app/components/RevenueChart.tsx
'use client';

import { use } from 'react';

export interface RevenueData {
  monthlyTotal: number;
  breakdown: Array<{ month: string; amount: number }>;
}

export function RevenueChart({
  revenuePromise,
}: {
  revenuePromise: Promise<RevenueData>;
}) {
  // Unwraps the streamed promise; throws to ErrorBoundary if rejected
  const data = use(revenuePromise);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
      <p className="text-2xl font-semibold text-emerald-600 mt-1">
        ${data.monthlyTotal.toLocaleString()}
      </p>
      <ul className="mt-3 divide-y text-sm">
        {data.breakdown.map((item) => (
          <li key={item.month} className="py-1.5 flex justify-between">
            <span>{item.month}</span>
            <span className="font-mono">${item.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

#### 2. The Stream Error Fallback Component

Provide an isolated error UI with a retry trigger:

```tsx
// app/components/StreamErrorFallback.tsx
'use client';

interface StreamErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  isRetrying?: boolean;
}

export function StreamErrorFallback({
  error,
  resetErrorBoundary,
  isRetrying,
}: StreamErrorFallbackProps) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-900 space-y-3">
      <div>
        <h4 className="font-semibold text-sm">Failed to stream data</h4>
        <p className="text-xs text-red-700 mt-0.5">
          {error.message || 'A network error occurred while loading this section.'}
        </p>
      </div>

      <button
        onClick={resetErrorBoundary}
        disabled={isRetrying}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition disabled:opacity-50"
      >
        {isRetrying ? 'Retrying...' : 'Retry Stream'}
      </button>
    </div>
  );
}

```

---

#### 3. The Stream Orchestrator with Transition-Based Retry

To allow retrying the stream without reloading the entire page, coordinate `resetBoundary()` with a fresh promise wrapped inside **`startTransition`**:

```tsx
// app/components/RevenueSection.tsx
'use client';

import { useState, useTransition, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RevenueChart, type RevenueData } from './RevenueChart';
import { StreamErrorFallback } from './StreamErrorFallback';
import { fetchRevenueData } from '@/lib/api';

export function RevenueSection({
  initialPromise,
}: {
  initialPromise: Promise<RevenueData>;
}) {
  const [streamPromise, setStreamPromise] = useState(initialPromise);
  const [isPending, startTransition] = useTransition();

  const handleRetry = (resetBoundary: () => void) => {
    startTransition(() => {
      // 1. Clear the Error Boundary state
      resetBoundary();
      // 2. Assign a fresh promise to replace the rejected one
      setStreamPromise(fetchRevenueData());
    });
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <StreamErrorFallback
          error={error}
          resetErrorBoundary={() => handleRetry(resetErrorBoundary)}
          isRetrying={isPending}
        />
      )}
    >
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart revenuePromise={streamPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function ChartSkeleton() {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 animate-pulse space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-20 bg-gray-200 rounded w-full" />
    </div>
  );
}

```

---

#### 4. The Server Component (RSC Page)

Initiate the async data stream on the server and pass the raw Promise down:

```tsx
// app/dashboard/page.tsx (Server Component)
import { RevenueSection } from '@/app/components/RevenueSection';
import { fetchRevenueData } from '@/lib/api';

export default function DashboardPage() {
  // Fire the promise on the server without awaiting
  const revenuePromise = fetchRevenueData();

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Financial Analytics</h1>
      
      {/* Streamed section operates in complete isolation */}
      <RevenueSection initialPromise={revenuePromise} />
    </main>
  );
}

```

---

### What Happens When a Stream Fails

| Scenario                                      | Server Behavior                                                    | Client Behavior                                                                                                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Error before initial HTML flush**           | Server catches the error during the initial render pass.           | Full-page error boundary (`error.tsx`) catches it before anything streams.                                                                                                                                           |
| **Error during chunk streaming (post-flush)** | Server writes an error chunk into the Flight HTTP response stream. | The browser receives the chunk; `use(promise)` rejects; the nearest `<ErrorBoundary>` catches it and swaps the `<Suspense>` fallback for the error UI. Other independent streams on the page continue uninterrupted. |
| **User clicks "Retry"**                       | Server action / fetch generates a fresh promise.                   | `startTransition` keeps the error view interactive until the retry resolves, avoiding screen flashing.                                                                                                               |

---

### Production Best Practices

* **Always Nest `<Suspense>` Inside `<ErrorBoundary>`:** If `<Suspense>` is placed outside `<ErrorBoundary>`, a rejected stream will bubble past the local boundary and trigger a higher-level or root error screen.
* **Isolate Unrelated Streams:** Give independent UI widgets their own separate `<ErrorBoundary>` + `<Suspense>` pairs so a failure in a non-critical widget (e.g., recommended items) doesn't break critical modules (e.g., checkout details).
* **Sanitize Production Error Messages:** Next.js and the React Flight protocol redact sensitive error details in production builds. Ensure expected errors are transformed into descriptive user-facing strings before returning them to the client.
