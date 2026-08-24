# Problem: Combine Suspense with an Error Boundary for a Retry UI

## Task

A lazily-loaded component's dynamic import can fail (bad network, or a stale chunk hash after a deploy). Instead of letting that crash the app, show a "failed to load" message with a retry button that lets the user attempt the import again.

## Solution

```jsx
import { lazy, Suspense, Component, useState } from "react";

const Widget = lazy(() => import("./Widget"));

class ChunkErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Log to your monitoring service here.
    console.error("Failed to load chunk:", error);
  }

  handleRetry = () => {
    // Resetting hasError re-renders `children`, which remounts the
    // lazy component and triggers a fresh import() attempt.
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <p>Something failed to load.</p>
          <button onClick={this.handleRetry}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // `key` forces a fresh mount of the whole subtree (including a fresh
  // lazy() import attempt) whenever retryCount changes, in case the
  // component instance itself needs a truly clean remount, not just a
  // boundary state reset.
  const [retryCount, setRetryCount] = useState(0);

  return (
    <ChunkErrorBoundary key={retryCount} onRetryRequested={() => setRetryCount((c) => c + 1)}>
      <Suspense fallback={<p>Loading widget…</p>}>
        <Widget />
      </Suspense>
    </ChunkErrorBoundary>
  );
}
```

A simpler version that doesn't need the outer `key` remount — sufficient for most cases, since resetting the boundary's own state already re-renders `children` and re-attempts the suspended import:

```jsx
function App() {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<p>Loading widget…</p>}>
        <Widget />
      </Suspense>
    </ChunkErrorBoundary>
  );
}
```

## Why this works

- `Suspense` only handles the "pending" case — a rejected `import()` throws an actual error, which propagates past `Suspense` (it has no error-handling behavior) up to the nearest error boundary.
- The `ChunkErrorBoundary` is placed *outside* the `Suspense` boundary so it can catch both a failed import and any render error from the resolved component.
- `getDerivedStateFromError` flips the boundary into its error UI; clicking "Retry" resets that state, which re-renders `children` — remounting `<Suspense><Widget /></Suspense>` and causing `React.lazy` to attempt the dynamic `import()` again.

## Things to watch out for

- If the failure is specifically a stale chunk hash from a new deploy (the old chunk file genuinely no longer exists on the server), a component-level retry will keep failing forever — the correct recovery in that case is `window.location.reload()` to fetch a fresh app shell, not just retrying the import. Consider distinguishing "transient network failure" (retry makes sense) from "stale deploy" (only a reload fixes it) if you can detect it (e.g., a chunk-load error name/message pattern from your bundler).
- Don't put the error boundary *inside* the `Suspense` boundary — it would then be part of what's "waiting," and wouldn't reliably catch an import failure that happens before anything renders.
- Keep the retry UI visually distinct from the loading fallback so users can tell the difference between "still loading" and "failed, action needed."
