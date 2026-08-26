# What Shows While BOTH Children Are Loading vs. Just One?

```jsx
const A = React.lazy(() => import("./A")); // resolves in 100ms
const B = React.lazy(() => import("./B")); // resolves in 500ms

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <A />
      <B />
    </Suspense>
  );
}
```

**Answer:** "Loading..." shows for the full 500ms — `A` does not appear at 100ms on its own; both `A` and `B` appear together once `B` also resolves.

**Why:** A single shared Suspense boundary treats its entire subtree as one unit — it stays on the fallback until every suspending descendant is ready, then reveals them together. To have `A` appear independently at 100ms, it would need its own nested Suspense boundary.
