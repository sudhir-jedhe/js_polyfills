*** copy 03-stale-closure-interval-logs-zero-forever.md ***

# What Does This Log Every Second, and What's the Bug?

```jsx
function Clock() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      console.log('count is', count);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{count}</p>;
}
```

**Answer:** It logs `count is 0` every single second, forever, and the displayed `<p>` also stays stuck at `1` (it increments once, from 0 to 1, and then stays there).

**Why:** The effect runs once (empty deps) and its `setInterval` callback closes over `count` and `setCount` as they existed on that first render — `count` is permanently `0` in that closure. Each tick calls `setCount(count + 1)`, i.e. `setCount(0 + 1)`, which sets state to `1` every time — not an increasing value, since `count` never updates inside this stale closure. The state does re-render the component each tick (with the same value, `1`, after the first tick), but the closure itself is frozen.
