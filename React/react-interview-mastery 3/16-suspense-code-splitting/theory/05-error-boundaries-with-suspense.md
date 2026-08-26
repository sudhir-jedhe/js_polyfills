# Error Boundaries + Suspense

`React.lazy`'s dynamic import can fail (bad network, or a deploy just happened and the chunk hash changed). Suspense has no built-in error handling — `Suspense` only handles the "pending" case (a thrown promise). A failed dynamic import (e.g., a 404 on the chunk) is a thrown *error*, not a promise, and propagates up uncaught unless you pair `Suspense` with an actual error boundary.

## Placement

Place the error boundary *outside* the Suspense boundary so it can catch failures from the lazy import itself, as well as any render errors inside the suspended subtree:

```jsx
<ErrorBoundary fallback={<p>Failed to load. <button onClick={retry}>Retry</button></p>}>
  <Suspense fallback={<Spinner />}>
    <SettingsPanel />
  </Suspense>
</ErrorBoundary>
```

This gives you a complete state machine: loading (Suspense fallback), error (error boundary fallback), and success (the real component).

## Suspense fallback vs. error boundary fallback

| Aspect | Suspense `fallback` | Error boundary fallback |
|---|---|---|
| Triggered by | A thrown promise (something not ready yet) | A thrown error (something went wrong) |
| Typical UI | Spinner, skeleton | Error message, retry button |
| Placement | Wraps the async subtree directly | Placed above the Suspense boundary to catch import/render failures |
| Common mistake | Using Suspense alone and assuming failed imports are handled | Forgetting Suspense entirely and letting a lazy component throw an unhandled "suspended" state as if it were an error |

They solve different problems and are typically used together: error boundary outside, Suspense inside, covering the "went wrong" and "not ready yet" cases respectively.

## A subtlety for deploys

After a new deploy, a chunk's filename (with its content hash) may no longer exist on the server for a user who had the tab open before the deploy. This is a chunk-loading error, not a "not ready yet" state — the recovery action should typically be a hard reload (`window.location.reload()`) to fetch the new app shell and asset manifest, not just "try again," since the stale client-side module reference is permanently broken.
