# Snippet: Correctly Listing All Dependencies to Avoid a Stale useMemo Result

```jsx
function Cart({ items, taxRate }) {
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate),
    [items, taxRate] // both used, both listed
  );
  return <p>Total: {total.toFixed(2)}</p>;
}
```
