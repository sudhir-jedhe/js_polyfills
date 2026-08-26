# What's Logged, and How Many Renders Happen?

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  console.log("render", count);
  return <button onClick={handleClick}>{count}</button>;
}
// Click once, starting from count = 0.
```

**Answer:** Logs `"render 0"` (mount) then `"render 1"` (after click) — count ends at 1, not 3.

**Why:** All three `setCount(count + 1)` calls close over the same `count` value (0) from that render, so each schedules "set count to 1," and React batches them into a single update since they're inside an event handler. This is unrelated to React 18's automatic batching specifically — event handler batching existed before React 18 too; it demonstrates the stale-closure trap, not the new batching behavior.
