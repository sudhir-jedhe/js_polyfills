*** copy 04-when-to-memoize.md ***

# When Memoization Is Actually Worth It

Memoization has a cost too — React has to store the cached value/deps and compare deps on every render, which is not free. `useMemo`/`useCallback` are worth reaching for when:

- The computation is genuinely expensive (sorting/filtering large arrays, heavy math), not a cheap map/filter over a handful of items.
- The value/function is passed to a `React.memo`-wrapped child, and you specifically want to prevent that child from re-rendering.
- The value/function is a dependency of another hook (`useEffect`, `useMemo`), and referential stability prevents that hook from re-running unnecessarily.

They are **not** automatically a performance win for every computation and every callback — wrapping trivial values (`useMemo(() => a + b, [a, b])`) or every single handler in a component with no memoized children adds cognitive overhead and a small runtime cost for no measurable benefit. Profile first; don't reflexively wrap everything.

## Worth memoizing vs premature optimization

| Aspect | Worth memoizing | Premature optimization |
|---|---|---|
| Computation cost | Genuinely expensive (large array sort/filter, heavy math, complex derived state) | Cheap (a `+`, a short array `.map`, string concatenation) |
| Consumer | Passed to a `React.memo` child, or used in another hook's dependency array | Not passed anywhere that cares about referential stability |
| Effect on code | Prevents a measurable, profiled re-render or recomputation cost | Adds a dependency array to track and a small constant overhead, for no measurable gain |

Reach for `useMemo`/`useCallback` when you've identified (ideally via the React DevTools profiler) an actual expensive computation or unnecessary re-render chain. The most common mistake is memoizing everything defensively "just in case," which adds maintenance burden (every memoized value needs a correct, exhaustive dependency array) without a measurable performance benefit.

## Not a guarantee

`useMemo`/`useCallback` are not a hard guarantee that React will never discard the cache — React's documentation notes that in certain circumstances (e.g., freeing memory for offscreen components) React may choose to discard a memoized value and recompute it. In practice, for typical mounted components you can treat the memoization as reliable, but don't rely on `useMemo` as a substitute for `useRef` when you need a value guaranteed stable/mutable across renders (e.g., an instance variable) — `useRef` is the correct tool for that guarantee.
