# What Happens If the Dynamic Import Fails (e.g., 404 on the Chunk)?

```jsx
const Broken = React.lazy(() => import("./DoesNotExist"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Broken />
    </Suspense>
  );
}
```

**Answer:** The app crashes with an unhandled error (React unmounts the tree and, in development, shows the red error overlay) — nothing gracefully catches it.

**Why:** `Suspense` only handles the "pending" state of a thrown promise; it has no error-handling behavior. A rejected import is a thrown error, which needs an error boundary above the `Suspense` to be caught and given a fallback UI. Without one, it propagates up as an uncaught render error.
