***  03-index-as-key-input-desync.md ***

# What Happens on Click?

```jsx
function Toggle() {
  const [items, setItems] = React.useState(['a', 'b']);
  return (
    <div>
      {items.map((item, i) => (
        <input key={i} defaultValue={item} />
      ))}
      <button onClick={() => setItems(['c', ...items])}>Prepend</button>
    </div>
  );
}
```

**Answer:** After clicking, the input that used to show `b`'s value now shows `a`, and a new input shows `c` — but if the user had typed into either input first, the typed text appears to "jump" to the wrong item.

**Why:** Using the array index as `key` ties each input's identity to its position, not its data. When `c` is prepended, every item shifts position by one, so React matches the existing DOM `<input>` at position 0 to the new item `c` and reuses it (including whatever the user had typed there) rather than creating a fresh input. This is the classic index-as-key bug with uncontrolled inputs.
