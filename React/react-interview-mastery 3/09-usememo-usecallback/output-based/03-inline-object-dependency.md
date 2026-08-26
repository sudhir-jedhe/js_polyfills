*** copy 03-inline-object-dependency.md ***

# Output-Based: Inline Object Dependency Defeats useMemo

```jsx
function SearchPanel({ query }) {
  const options = { caseSensitive: false };

  const results = useMemo(() => {
    console.log('searching');
    return search(query, options);
  }, [query, options]);

  return <ResultsList results={results} />;
}
```

`SearchPanel` re-renders repeatedly due to an unrelated parent state change, with `query` staying the same each time. Does "searching" log on every one of those re-renders?

**Answer:** Yes, "searching" logs on every re-render, even though `query` never changes.

**Why:** `options` is a new object literal created fresh inside the component body on every render, so it's a new reference every time. It's listed as a `useMemo` dependency, and since `Object.is(newOptions, oldOptions)` is always `false`, the memoization is defeated — the expensive computation reruns every render regardless of `query`. The fix is to either move `options` outside the component (if it's truly constant) or wrap it in its own `useMemo` with an empty dependency array.
