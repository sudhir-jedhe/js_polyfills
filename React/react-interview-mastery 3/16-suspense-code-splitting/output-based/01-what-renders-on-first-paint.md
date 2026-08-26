# What Renders on First Paint?

```jsx
const Heavy = React.lazy(() => import("./Heavy"));

function App() {
  console.log("App render");
  return (
    <Suspense fallback={<p>Fallback</p>}>
      <Heavy />
    </Suspense>
  );
}
```

**Answer:** `"App render"` logs, then "Fallback" is shown, then once `Heavy`'s chunk downloads, `Heavy` replaces it.

**Why:** `React.lazy` throws a promise the first time `Heavy` is rendered because the module isn't loaded yet. Suspense catches that thrown promise and renders `fallback` instead, then re-renders the subtree once the promise resolves. `App` itself renders normally since the suspension happens inside `Heavy`, below the boundary.
