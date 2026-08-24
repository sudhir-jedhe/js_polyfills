# useDeferredValue to Defer an Expensive Derived List

```jsx
function ProductList({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const filtered = useMemo(
    () => expensiveSearch(deferredQuery),
    [deferredQuery]
  );

  return (
    <ul style={{ opacity: isStale ? 0.6 : 1 }}>
      {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```
