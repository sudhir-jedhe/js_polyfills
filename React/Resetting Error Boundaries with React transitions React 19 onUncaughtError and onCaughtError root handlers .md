Resetting Error Boundaries with React transitions
React 19 onUncaughtError and onCaughtError root handlers

### 1. Resetting Error Boundaries with Transitions

When an Error Boundary catches an error (e.g., a rejected streamed promise via `use()` or a failed dynamic render), resetting the boundary while retrying the action without a transition causes an immediate fallback flash or an uncoordinated re-throw.

Wrapping the reset logic in **`startTransition`** coordinates the boundary reset with the new render pass. React keeps the existing error fallback interactive in the background while speculatively rendering the retried tree.

---

#### The Pattern: Synchronized Retry with `startTransition`

```tsx
'use client';

import { useState, useTransition, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { UserProfile } from './UserProfile';
import { fetchUserData } from '@/lib/api';

export function ProfileSection({ initialPromise }: { initialPromise: Promise<User> }) {
  const [userPromise, setUserPromise] = useState(initialPromise);
  const [isPending, startTransition] = useTransition();

  const handleRetry = (resetBoundary: () => void) => {
    startTransition(() => {
      // 1. Clear the Error Boundary's caught state
      resetBoundary();
      // 2. Supply a new promise / state to trigger the retry
      setUserPromise(fetchUserData());
    });
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="p-4 border border-red-200 bg-red-50 rounded space-y-2">
          <p className="text-red-700 text-sm">Failed to load profile: {error.message}</p>
          <button
            onClick={() => handleRetry(resetErrorBoundary)}
            disabled={isPending}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-xs disabled:opacity-50"
          >
            {isPending ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      )}
    >
      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

```

* **Without `startTransition`:** Resetting the boundary causes it to immediately mount the child, suspend on the pending promise, and aggressively flash the `<Suspense>` skeleton.
* **With `startTransition`:** React treats the retry as a concurrent transition. The error UI stays visible with `isPending: true` until the new promise resolves, swapping to the fulfilled component seamlessly.

---

### 2. React 19 Root Error Handlers

In React 19, error logging is overhauled. Instead of relying on `window.onerror` hacks or dealing with React's automatic duplicate `console.error` logs, `createRoot` and `hydrateRoot` provide centralized error callback hooks: **`onCaughtError`**, **`onUncaughtError`**, and **`onRecoverableError`**.

```
                           [Error Thrown in Component Tree]
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                             │
      [Caught by an ErrorBoundary]                  [No ErrorBoundary Enclosing]
                   │                                             │
                   ▼                                             ▼
          `onCaughtError()`                             `onUncaughtError()`
   (Telemetry: Handled exceptions)              (Telemetry: Fatal unhandled crashes)

```

---

#### Root Configuration Setup

```tsx
// index.tsx / main.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import { reportErrorToAnalytics } from './telemetry';

const container = document.getElementById('root')!;

const root = createRoot(container, {
  // 1. Fired when an error is caught and handled by an ErrorBoundary
  onCaughtError(error, errorInfo) {
    console.warn('[Handled Error]:', error);
    reportErrorToAnalytics({
      error,
      componentStack: errorInfo.componentStack,
      fatal: false,
    });
  },

  // 2. Fired when an error bubbles to the root without being caught
  onUncaughtError(error, errorInfo) {
    console.error('[Fatal Crash]:', error);
    reportErrorToAnalytics({
      error,
      componentStack: errorInfo.componentStack,
      fatal: true,
    });
  },

  // 3. Fired when React recovers from hydration mismatch or transient render issues
  onRecoverableError(error, errorInfo) {
    console.info('[Recoverable Warning]:', error);
    reportErrorToAnalytics({
      error,
      componentStack: errorInfo.componentStack,
      level: 'warning',
    });
  },
});

root.render(<App />);

```

---

#### Differences Between the Root Handlers

| Option                   | Trigger Condition                                                                  | Severity                         | Common Telemetry Mapping                                |
| ------------------------ | ---------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------- |
| **`onCaughtError`**      | Thrown inside a component tree wrapped by a `<ErrorBoundary>`.                     | Non-fatal (handled UI displayed) | Sentry / Datadog: `level: 'warning'` or `handled: true` |
| **`onUncaughtError`**    | Thrown where **no** Error Boundary exists to catch it.                             | Fatal (unhandled app crash)      | Sentry / Datadog: `level: 'fatal'` or `handled: false`  |
| **`onRecoverableError`** | Thrown during hydration mismatch or when React automatically retries and recovers. | Non-fatal (automatic recovery)   | Sentry / Datadog: `level: 'info'` (Hydration diffs)     |

---

### Key Takeaways

1. **Coordinate Reset with State:** Always pair `resetErrorBoundary()` with the state or promise re-assignment inside the **same** `startTransition` batch.
2. **Unified Error Reporting:** Use `onCaughtError` and `onUncaughtError` on `createRoot` / `hydrateRoot` as the single source of truth for third-party monitoring services (Datadog, Sentry, LogRocket), removing the need for custom `componentDidCatch` telemetry wrappers on every individual boundary.
3. **Hydration Monitoring:** `onRecoverableError` captures mismatch errors without polluting user-facing error boundaries, making it the ideal place to inspect server-vs-client markup divergences.
