# Output-Based: Does an Index Key Cause a Problem Here?

```jsx
function List({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.text}</li>
      ))}
    </ul>
  );
}
// items initially: [{text:'a'},{text:'b'},{text:'c'}]
// then user deletes the first item -> [{text:'b'},{text:'c'}]
```
**Answer:** The list re-renders "correctly" visually (shows b, c) but React reuses the DOM node/state that belonged to index 0 ("a") for "b", and the node for index 1 ("c") for the new index 1 — i.e., it patches text in place rather than removing the first `<li>` and shifting.

**Why:** Using array index as `key` ties identity to position, not to the item itself. When the first item is removed, every subsequent item shifts up one index, so React thinks the *elements* stayed the same and only their content changed — it diffs/updates text content instead of unmounting/remounting. This is invisible for plain text but breaks badly for components holding their own state (e.g., uncontrolled inputs) at each row.
