*** copy 03-dependency-array-pitfalls.md ***

# Interview Q&A: Dependency-Array Pitfalls

**Q: What's the classic bug with an incomplete dependency array in `useMemo`/`useCallback`?**

A "stale closure" — if the memoized function/computation reads a variable that isn't listed in the dependency array, the cached result (or function) keeps using the old value from whenever it was last recomputed, silently ignoring subsequent updates to that variable.

```jsx
const total = useMemo(
  () => items.reduce((s, i) => s + i.price, 0) * (1 + taxRate),
  [items] // BUG: taxRate is used but missing — total goes stale when taxRate changes
);
```

The `eslint-plugin-react-hooks` `exhaustive-deps` rule catches most of these automatically and should be treated as a strong signal, not a suggestion to silence.

---

**Q: What happens if you list an inline object literal as a `useMemo`/`useCallback` dependency?**

The memoization is effectively defeated, because the object is a new reference on every render, so the dependency comparison always reports "changed," forcing recomputation every time regardless of whether the object's actual contents changed.

```jsx
const results = useMemo(() => search(query, { caseSensitive: false }), [query, { caseSensitive: false }]);
// the inline object dependency is new every render — useMemo never actually caches anything
```

The fix is to hoist constant objects outside the component, or wrap them in their own `useMemo`.

---

**Q: Are `useMemo` and `useCallback` guaranteed to always return the cached value/function, or can React discard the cache?**

They're not a hard guarantee in the strictest sense — React's documentation notes that in certain circumstances (e.g., freeing memory for offscreen components) React may choose to discard a memoized value and recompute it. In practice, for typical mounted components you can treat the memoization as reliable, but you should not rely on `useMemo` as a substitute for `useRef` when you need a value to be guaranteed stable/mutable across renders (e.g., an instance variable) — `useRef` is the correct tool for that guarantee.
