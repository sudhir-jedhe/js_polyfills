*** copy 02-empty-deps-effect-runs-once-only.md ***

# What Logs When the Count Button Is Clicked, Using This Effect?

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    console.log('effect ran, count =', count);
  }, []);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Answer:** `effect ran, count = 0` logs exactly once, on mount. Clicking the button does not log anything else.

**Why:** The empty dependency array means the effect runs only once, after the initial render, and never again — regardless of how many times `count` subsequently changes. The effect's closure permanently captured `count = 0` from that first render.
