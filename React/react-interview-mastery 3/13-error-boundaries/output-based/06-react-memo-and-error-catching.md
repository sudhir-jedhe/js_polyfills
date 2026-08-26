# Does Wrapping `Buggy` in `React.memo` Change Whether the Error Boundary Catches Its Render Error?

```jsx
const Buggy = React.memo(function Buggy({ data }) {
  return <p>{data.value}</p>; // throws if data is undefined
});
function App() {
  return (
    <ErrorBoundary>
      <Buggy data={undefined} />
    </ErrorBoundary>
  );
}
```

**Answer:** No — the fallback UI still shows correctly.

**Why:** `React.memo` only affects whether a component re-renders given the same props; it doesn't change how errors thrown during that render are propagated. The error still occurs during React's render phase inside the boundary's subtree, so it's caught exactly the same way as an unmemoized component.
