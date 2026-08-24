# useMemo: Caching a Computed Value

`useMemo(fn, deps)` re-runs `fn` and caches its return value, only recomputing when one of the values in `deps` changes between renders. On every render where deps are unchanged, React returns the cached value without calling `fn` again.

```jsx
function ProductList({ products, filterText }) {
  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(filterText)),
    [products, filterText]
  );
  return <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

Without `useMemo`, `products.filter(...)` reruns on *every* render of `ProductList`, including renders triggered by completely unrelated state elsewhere in the app (if this component re-renders for other reasons). For a cheap filter over a small array, that's irrelevant. For a heavy computation (sorting/filtering thousands of rows, complex derived calculations), it can matter.

## Quick reference: useMemo vs useCallback

| Aspect | `useMemo` | `useCallback` |
|---|---|---|
| Memoizes | The *return value* of a function you call inline | The *function reference* itself, not called |
| Signature | `useMemo(() => computeValue(), deps)` | `useCallback(fn, deps)` |
| Equivalent form | — | `useMemo(() => fn, deps)` |

Use `useMemo` when you need to cache a computed value (a filtered array, a derived number, an object). Use `useCallback` specifically when you need to cache a function reference (an event handler passed to a memoized child, an effect dependency). See `theory/02-usecallback-basics.md` for the function-caching side of this.
