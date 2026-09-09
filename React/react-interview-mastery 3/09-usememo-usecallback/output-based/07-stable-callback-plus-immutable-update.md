***  07-stable-callback-plus-immutable-update.md ***

# Output-Based: Stable Callback + Immutable Update Skips Unrelated Rows

```jsx
const Item = React.memo(function Item({ item, onDelete }) {
  console.log('Item render:', item.id);
  return <li>{item.name}<button onClick={() => onDelete(item.id)}>x</button></li>;
});

function List({ items, onDelete }) {
  return (
    <ul>
      {items.map((item) => (
        <Item key={item.id} item={item} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function App() {
  const [items, setItems] = useState([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);
  const handleDelete = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    []
  );
  return <List items={items} onDelete={handleDelete} />;
}
```

The user deletes item with id `1`. Does `Item` for id `2` re-render?

**Answer:** No — `Item` for id `2` does not re-render.

**Why:** `handleDelete` is memoized with `useCallback(..., [])`, so it's referentially stable across `App` re-renders (and it correctly uses the functional updater `setItems(prev => ...)`, so it never needs `items` in its own closure/deps). `items` itself is a new array reference after filtering (expected, since state changed), but the individual `item` object for id `2` is untouched — same reference as before. Since `Item` is wrapped in `React.memo` and both `item` (unchanged reference) and `onDelete` (stable via `useCallback`) pass the shallow-equality check, `Item` for id `2` skips re-rendering. Only the removed item's `Item` disappears from the list; id `1`'s component unmounts, id `2`'s never re-renders.
