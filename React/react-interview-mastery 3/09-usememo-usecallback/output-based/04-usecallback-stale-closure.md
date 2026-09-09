***  04-usecallback-stale-closure.md ***

# Output-Based: useCallback Stale Closure

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const logCount = useCallback(() => {
    console.log(count);
  }, []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={logCount}>Log count</button>
    </div>
  );
}
```

The user clicks "Increment" 3 times, then clicks "Log count". What logs?

**Answer:** `0`, not `3`.

**Why:** `useCallback(fn, [])` memoizes `logCount` once, on the initial render, and reuses that exact same function forever since the dependency array never changes. That original function closed over `count` as it was on the first render — `0`. Later renders create new `count` values, but `logCount` was never recreated to capture them, so it's a stale closure. Fixing it requires `[count]` as the dependency array (recreating `logCount` whenever `count` changes) or using the functional form if applicable.
