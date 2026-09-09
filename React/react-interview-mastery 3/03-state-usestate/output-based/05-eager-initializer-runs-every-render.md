***  05-eager-initializer-runs-every-render.md ***

# What Renders, and What's the Bug?

```jsx
function ExpensiveInit() {
  console.log('component render');
  const [data] = React.useState(computeExpensive());
  return <div>{data}</div>;
}
function computeExpensive() {
  console.log('computing...');
  return Math.random();
}
```

**Answer:** `computing...` logs on *every* render of `ExpensiveInit`, not just the first — even though the computed value is discarded on subsequent renders (state stays at its original value after mount).

**Why:** `React.useState(computeExpensive())` evaluates the argument expression eagerly, every single render, because that's normal JavaScript function-call evaluation order — the argument is computed before `useState` is even called. React only *uses* that value on the first render, but the function still runs every time. The fix is the lazy form: `useState(() => computeExpensive())`, so React only invokes the function on mount.
