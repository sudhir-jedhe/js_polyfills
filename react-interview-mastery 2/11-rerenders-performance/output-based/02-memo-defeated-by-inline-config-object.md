# Output-Based: Does Wrapping in React.memo Change the Outcome Here?

```jsx
const Child = React.memo(function Child({ config }) {
  console.log('Child render');
  return <span>{config.label}</span>;
});
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Child config={{ label: 'fixed' }} />
    </>
  );
}
```
**Answer:** No — "Child render" still logs on every click, even though `Child` is memoized.

**Why:** `memo` does a shallow comparison of props. `config` is a new object literal created on every `Parent` render, so `Object.is(prevConfig, nextConfig)` is `false`. The label's *value* is unchanged but the reference isn't, so `memo` bails out and re-renders anyway.
