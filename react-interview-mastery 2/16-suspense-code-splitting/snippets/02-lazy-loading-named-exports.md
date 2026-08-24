# Lazy-Loading a Module with Named Exports

```jsx
// Chart.js exports `export function Chart() {...}` (named, not default)
const Chart = React.lazy(() =>
  import("./Chart").then((mod) => ({ default: mod.Chart }))
);

function Report() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <Chart />
    </Suspense>
  );
}
```
