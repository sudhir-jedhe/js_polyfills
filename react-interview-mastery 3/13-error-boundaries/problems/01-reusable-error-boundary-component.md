# Problem: Implement a Reusable `<ErrorBoundary>` Component

**Requirements:**
- A class component named `ErrorBoundary`.
- Accepts a `fallback` prop — either a static element or a render function `(error, reset) => ReactNode` — so callers can customize the fallback UI per usage.
- Accepts an `onError` callback invoked with `(error, errorInfo)` for logging (e.g., to Sentry/Datadog), kept separate from the render-phase state update.
- Exposes a way to reset the boundary (e.g., a `reset()` method passed to the fallback) so callers can offer a "Try again" affordance without forcing a full page reload.

## Solution

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    // pure — only compute the state needed to show a fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // side effects live here, not in getDerivedStateFromError
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (typeof fallback === 'function') {
        return fallback(error, this.reset);
      }
      return fallback ?? <p>Something went wrong.</p>;
    }

    return children;
  }
}

export default ErrorBoundary;
```

## Usage

```jsx
function logErrorToService(error, errorInfo) {
  console.error('[ErrorBoundary]', error, errorInfo.componentStack);
  // e.g. Sentry.captureException(error, { extra: errorInfo });
}

function App() {
  return (
    <ErrorBoundary
      onError={logErrorToService}
      fallback={(error, reset) => (
        <div role="alert">
          <p>Something went wrong: {error.message}</p>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      <Dashboard />
    </ErrorBoundary>
  );
}
```

**Notes:**
- `getDerivedStateFromError` stays pure (no logging) — all side effects happen in `componentDidCatch`, which is where `onError` is invoked.
- `fallback` supports both a plain element (`fallback={<p>Oops</p>}`) and a render-prop function that receives `(error, reset)` for interactive fallbacks.
- `reset()` only re-renders `children` fresh — if the underlying cause is deterministic (bad data), pair it with refetching data or changing a `key` upstream so the retry has a chance of succeeding.
