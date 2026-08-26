# Does the List Re-render with the New Item?

```jsx
function List() {
  const [items, setItems] = useState(["a", "b"]);

  function addItem() {
    items.push("c");
    setItems(items);
  }

  return (
    <div>
      <button onClick={addItem}>add</button>
      <ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
    </div>
  );
}
```

**Answer:** No visible re-render — the DOM does not show "c" after clicking, even though `items` has actually been mutated to `["a", "b", "c"]` internally.

**Why:** `setItems(items)` passes the exact same array reference back to React. React's `useState` setter bails out of re-rendering when the new value is reference-equal (`Object.is`) to the current state for primitives, and while objects/arrays don't get deep-compared, React's scheduling here still may not trigger a re-render reliably since nothing signals a change — in practice this is undefined/fragile behavior that depends on React internals, which is exactly why mutating state directly is an anti-pattern: correctness shouldn't hinge on implementation details.
