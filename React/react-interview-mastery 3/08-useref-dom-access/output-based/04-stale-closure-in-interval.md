*** copy 04-stale-closure-in-interval.md ***

# Output-Based: What number does a `setInterval` with an empty-deps effect get stuck at?

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // note: uses `count`, not the updater form
    }, 1000);
    return () => clearInterval(id);
  }, []); // empty deps

  return <p>{count}</p>;
}
```

What number does the display get stuck at?

**Answer:** It increments once, to `1`, then stays at `1` forever.

**Why:** The effect runs once (empty deps), capturing `count = 0` in its closure at that time. `setInterval`'s callback keeps calling `setCount(0 + 1)` every second — always computing `1` from the same stale `count = 0`, because the closure was never recreated (the effect never re-ran to capture a fresh `count`). This is the classic stale-closure bug and is directly relevant to `useRef`: storing the latest `count` in a ref (updated every render) and reading `ref.current` inside the interval callback is the standard fix, or using the functional updater `setCount(c => c + 1)`.
