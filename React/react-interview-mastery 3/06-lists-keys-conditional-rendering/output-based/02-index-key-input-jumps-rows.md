*** copy 02-index-key-input-jumps-rows.md ***

# Output-Based: Index-keyed input state jumps to the wrong row after a removal

```jsx
function List() {
  const [items, setItems] = useState(['a', 'b', 'c']);
  return (
    <div>
      <button onClick={() => setItems((prev) => prev.filter((i) => i !== 'a'))}>
        Remove a
      </button>
      {items.map((item, index) => (
        <RowWithInput key={index} label={item} />
      ))}
    </div>
  );
}

function RowWithInput({ label }) {
  const [text, setText] = useState('');
  return (
    <div>
      {label}: <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
```

If the user types "hello" into the input next to "b" (index 1), then clicks "Remove a", what happens to the input text?

**Answer:** The "hello" text stays visible, but now it appears next to "c" instead of "b".

**Why:** Keys are index-based, so after removing `'a'`, the array shifts: `'b'` and `'c'` move to indices 0 and 1. React matches by key (index), so the component instance that was at index 1 (holding `text = 'hello'` in its own state) is reused for whatever item now sits at index 1 — which is `'c'`. The DOM node and its internal state are not tied to the label, only to the position.
