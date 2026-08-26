# Deriving a Value During Render Instead of Syncing via useEffect

```jsx
function PriceSummary({ items }) {
  // no effect, no extra state — just computed on every render
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return <p>Total: ${total.toFixed(2)}</p>;
}
```
