***  01-usememo-expensive-filter.md ***

# Snippet: useMemo Caching an Expensive Filter/Sort

```jsx
function ProductTable({ products, query }) {
  const visible = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );
  return <ul>{visible.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```
