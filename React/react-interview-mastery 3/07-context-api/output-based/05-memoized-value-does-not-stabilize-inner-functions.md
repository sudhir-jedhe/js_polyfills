*** copy 05-memoized-value-does-not-stabilize-inner-functions.md ***

# Output-Based: Does `useMemo`-wrapping the context value also stabilize the functions inside it?

```jsx
const CounterContext = createContext();

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  const value = useMemo(() => ({ count, increment }), [count]);
  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
}
```

Is `increment` guaranteed to be referentially stable across renders where `count` doesn't change?

**Answer:** The `value` object is stable (same reference) when `count` doesn't change, thanks to `useMemo`. But `increment` itself is a brand-new function on every render of `CounterProvider` — it just happens not to matter here because it's only re-exposed through `value` when `count` changes.

**Why:** This is a subtle trap: `useMemo`'s dependency array only lists `count`, so the memoized `value` object is reused when `count` is unchanged — but `increment` was still recreated fresh before being passed into that memo call. If `increment` were used directly elsewhere as a `useEffect` dependency (bypassing `value`), it would cause effects to re-run every render. Wrapping `increment` itself in `useCallback` would fix that independently.
