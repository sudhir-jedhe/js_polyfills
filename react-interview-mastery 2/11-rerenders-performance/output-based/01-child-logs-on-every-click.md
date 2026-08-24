# Output-Based: Does `Child` Log on Every Click?

```jsx
function Child({ value }) {
  console.log('Child render');
  return <span>{value}</span>;
}
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <Child value="fixed" />
    </>
  );
}
```
**Answer:** Yes, "Child render" logs on every click.

**Why:** `Child` is not memoized, so it re-renders whenever its parent re-renders — regardless of whether its own props changed. `setCount` triggers `Parent` to re-render, which re-renders `Child` unconditionally.
