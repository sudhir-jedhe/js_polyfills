# Output-Based: Will memo Prevent the Re-Render Here?

```jsx
const Child = React.memo(function Child({ items }) {
  console.log('Child render');
  return <span>{items.length}</span>;
});
function Parent() {
  const [tick, setTick] = useState(0);
  const items = [1, 2, 3]; // recreated every render
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>{tick}</button>
      <Child items={items} />
    </>
  );
}
```
**Answer:** No — `Child` re-renders on every click.

**Why:** Same shallow-comparison caveat as objects: `[1,2,3]` is a new array reference every render even though its contents are identical. `memo` compares by reference for non-primitives, so it never skips here. Wrapping `items` in `useMemo(() => [1,2,3], [])` would fix it.
