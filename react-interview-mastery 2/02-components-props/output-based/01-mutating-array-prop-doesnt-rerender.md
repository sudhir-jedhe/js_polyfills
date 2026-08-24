# What Happens on Click?

```jsx
function List({ items }) {
  function handleClick() {
    items.push('new item');
    console.log(items);
  }
  return (
    <div>
      <ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
      <button onClick={handleClick}>Add</button>
    </div>
  );
}
```

**Answer:** The `console.log` shows the array with `'new item'` appended, but the UI never updates to show it — the `<ul>` stays visually unchanged.

**Why:** `items.push` mutates the array in place but doesn't call any state setter, so React has no signal that anything changed and never re-renders. Even if a parent's `useState` owns this array, mutating it directly (instead of calling `setItems([...items, 'new item'])`) breaks React's re-render trigger, which is a `setState` call — not a change to the underlying reference contents.
