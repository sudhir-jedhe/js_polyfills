# Output-Based: Inline `onClick` in `.map()` Defeats memo for Every Row

```jsx
const Row = React.memo(({ id, onClick }) => {
  console.log('Row', id);
  return <li onClick={onClick}>{id}</li>;
});
function List() {
  const [items] = useState([1, 2, 3]);
  const [selected, setSelected] = useState(null);
  return (
    <ul>
      {items.map(id => (
        <Row key={id} id={id} onClick={() => setSelected(id)} />
      ))}
    </ul>
  );
}
```
**Answer:** On mount: `Row 1`, `Row 2`, `Row 3`. After clicking any row: all three `Row` logs fire again.

**Why:** `onClick={() => setSelected(id)}` creates a brand-new function on every `List` render for every row. Even though only `selected` changed, every `Row`'s `onClick` prop reference changed too, so `memo`'s shallow comparison fails for all three rows, not just the clicked one.
