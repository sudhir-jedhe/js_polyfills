How do you reset React Error Boundaries and retry failed streamed promises using startTransition?

When a streamed promise rejects, the `use()` hook throws the error into the nearest `<ErrorBoundary>`.

To allow the user to **retry** the failed operation without a full page reload, you must:

1. Create a fresh promise instance to replace the rejected one.
2. Clear the Error Boundary's caught state.
3. Wrap both actions inside **`startTransition`** so React coordinates the suspended retry concurrently without layout flashes.

---

### Why `startTransition` Is Essential for Retries

If you reset an Error Boundary and immediately read a new pending promise *without* a transition:

* React resets the error, immediately suspends on the pending promise, and violently flashes the `<Suspense>` fallback (skeleton/spinner).
* Wrapping the retry in `startTransition` tells React: *"Keep the existing Error UI interactive while the new promise begins resolving in the background, showing a pending indicator instead of abruptly blowing away the view."*

---

### Step-by-Step Implementation

#### 1. The Retryable Client Container

Manage the promise reference in state, and pass a retry callback down to the Error Boundary fallback:

```tsx
'use client';

import { useState, useTransition, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LiveFeed } from './LiveFeed';
import { fetchLiveFeed } from '@/lib/api';

export function FeedContainer({ initialPromise }: { initialPromise: Promise<string[]> }) {
  const [feedPromise, setFeedPromise] = useState(initialPromise);
  const [isPending, startTransition] = useTransition();

  const handleRetry = (resetBoundary: () => void) => {
    startTransition(() => {
      // 1. Reset the Error Boundary state
      resetBoundary();
      // 2. Trigger a fresh promise to replace the rejected one
      setFeedPromise(fetchLiveFeed());
    });
  };

  return (
    <div className="feed-wrapper">
      <ErrorBoundary
        onReset={() => {
          // Optional cleanup logic before remount
        }}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            isPending={isPending}
            onRetry={() => handleRetry(resetErrorBoundary)}
          />
        )}
      >
        <Suspense fallback={<FeedSkeleton />}>
          <LiveFeed feedPromise={feedPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

```

---

#### 2. The Consuming Component (`use`)

The component consumes the promise via `use()`. If the newly initiated promise resolves successfully, React commits the new state and renders the items:

```tsx
// LiveFeed.tsx
'use client';

import { use } from 'react';

export function LiveFeed({ feedPromise }: { feedPromise: Promise<string[]> }) {
  // Unwraps the active promise. Throws to ErrorBoundary if rejected.
  const items = use(feedPromise);

  return (
    <ul className="divide-y">
      {items.map((item, index) => (
        <li key={index} className="py-2">{item}</li>
      ))}
    </ul>
  );
}

```

---

#### 3. The Error Fallback Component

Provide an explicit retry button that displays `isPending` state during the transition:

```tsx
// ErrorFallback.tsx
interface ErrorFallbackProps {
  error: Error;
  isPending: boolean;
  onRetry: () => void;
}

export function ErrorFallback({ error, isPending, onRetry }: ErrorFallbackProps) {
  return (
    <div className="p-4 border border-red-200 rounded bg-red-50 text-red-800 space-y-3">
      <p className="font-medium">Failed to load live feed: {error.message}</p>
      
      <button
        onClick={onRetry}
        disabled={isPending}
        className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 transition"
      >
        {isPending ? 'Retrying connection...' : 'Retry'}
      </button>
    </div>
  );
}

function FeedSkeleton() {
  return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
}

```

---

### Retry Lifecycle Flow

```
[1. Promise Rejects] ──▶ `use(promise)` throws ──▶ ErrorBoundary renders `ErrorFallback`
                                                                │
                                                                ▼ (User clicks "Retry")
[2. startTransition] ───────────────────────────────────────────┘
       │
       ├── `resetErrorBoundary()` clears the caught error state
       └── `setFeedPromise(newPromise)` starts new fetch in background
       │
       ▼
[3. Transition In-Flight (`isPending === true`)]
       ├── ErrorFallback remains visible on screen
       └── Retry button shows "Retrying connection..."
       │
       ▼ (New promise fulfills)
[4. Commit Phase] ──▶ React swaps Error UI for `<LiveFeed />` with fresh data

```

---

### Key Rules for Transition-Based Retries

* **Never mutate the rejected promise:** Always construct a new Promise instance (e.g., calling `fetchLiveFeed()` again). A rejected promise in JavaScript permanently stays rejected.
* **Sync the state update with `resetErrorBoundary`:** Both `resetBoundary()` and the state setter (`setFeedPromise`) must execute inside the **same** `startTransition` closure so React reconciles them in a single batch.
* **Preserve UI Context with `isPending`:** Disabling the retry button while `isPending` is true prevents users from spamming the endpoint while the network request is active.
