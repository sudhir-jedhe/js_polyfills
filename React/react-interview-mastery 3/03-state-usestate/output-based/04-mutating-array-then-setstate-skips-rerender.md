***  04-mutating-array-then-setstate-skips-rerender.md ***

# What Happens to the List After Clicking "Add" Twice?

```jsx
function List() {
  const [items, setItems] = React.useState([]);
  function addItem() {
    items.push(items.length);
    setItems(items);
  }
  return (
    <>
      <button onClick={addItem}>Add</button>
      <ul>{items.map((n, i) => <li key={i}>{n}</li>)}</ul>
    </>
  );
}
```

**Answer:** Nothing visibly changes in the UI after either click, even though `items` does grow internally.

**Why:** `.push()` mutates the array in place, so `setItems(items)` is called with the *same reference* the state already holds. React's default bailout check (`Object.is` comparison) sees no reference change and skips the re-render, even though the array's contents did change. The fix is `setItems(prev => [...prev, prev.length])` to produce a new array reference.
