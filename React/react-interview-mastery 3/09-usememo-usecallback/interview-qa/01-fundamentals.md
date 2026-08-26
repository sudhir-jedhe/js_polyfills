*** copy 01-fundamentals.md ***

# Interview Q&A: Fundamentals

**Q: What does `useMemo` do, exactly?**

It caches the return value of a function across renders, only recomputing when one of the values in its dependency array changes. On renders where the dependencies are unchanged, React skips calling the function and returns the previously cached value.

```jsx
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
```

---

**Q: What does `useCallback` do, and how does it relate to `useMemo`?**

It returns a stable function reference across renders as long as its dependency array hasn't changed, instead of the function being recreated fresh on every render (the default behavior for any function declared inside a component body). `useCallback(fn, deps)` is exactly equivalent to `useMemo(() => fn, deps)` — it's implemented as a thin convenience wrapper around that pattern.

---

**Q: What's the practical difference between writing `useCallback(fn, deps)` and `useMemo(() => fn, deps)`?**

None in terms of runtime behavior — they produce the identical memoized function reference under the identical rules. The difference is purely idiomatic: `useCallback` communicates "I'm memoizing a function" more directly and is the conventional choice for that case, while `useMemo` is reserved for memoizing computed values. Using `useMemo` to memoize a function works but reads as unconventional in review.
