# After Deleting the First Item, What Does Each Remaining Input Show?

```jsx
function EditableList() {
  const [items, setItems] = useState(["Alice", "Bob", "Carol"]);

  function remove(indexToRemove) {
    setItems(items.filter((_, i) => i !== indexToRemove));
  }

  return items.map((name, i) => (
    <div key={i}>
      <input defaultValue={name} />
      <button onClick={() => remove(i)}>remove</button>
    </div>
  ));
}
// User types "ALICE!" into the first input, then clicks "remove" on the first row.
```

**Answer:** After removing the first row, the remaining visible input (originally showing "Bob") displays "ALICE!" instead of "Bob".

**Why:** With `key={i}` (index), when "Alice"'s row is removed, React reuses the DOM node that used to be `key={0}` for what is now Bob's row at index 0 — but `defaultValue` only sets the initial value on mount, and since React thinks it's the same component instance (same key), it doesn't remount the `<input>`, so the stale typed text "ALICE!" stays attached to the reused DOM node. This is the canonical index-key bug with uncontrolled inputs in a list.
