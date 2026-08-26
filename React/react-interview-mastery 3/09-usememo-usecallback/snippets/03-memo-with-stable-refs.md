*** copy 03-memo-with-stable-refs.md ***

# Snippet: React.memo Only Pays Off Paired With Stable Prop References

```jsx
const Row = React.memo(function Row({ label, onSelect }) {
  console.log('Row render:', label);
  return <li onClick={onSelect}>{label}</li>;
});

function RowList({ items }) {
  const handleSelect = useCallback((id) => console.log('selected', id), []);
  return (
    <ul>
      {items.map((item) => (
        <Row key={item.id} label={item.label} onSelect={() => handleSelect(item.id)} />
      ))}
    </ul>
  );
}
```

Note: `onSelect={() => handleSelect(item.id)}` is still a new inline arrow function per row per render — `handleSelect` itself is stable, but wrapping it inline here re-introduces the exact problem `useCallback` was meant to solve. A fully correct fix would pass `item.id` down and let `Row` call `onSelect(id)` internally, or curry/memoize per-row callbacks.
