*** copy 01-and-operator-renders-stray-zero.md ***

# What Renders?

```jsx
function Cart({ items }) {
  return <div>{items.length && <p>Items: {items.length}</p>}</div>;
}

// rendered with items = []
```

**Answer:** The div renders containing the text `0`.

**Why:** `items.length` is `0`, a falsy value, but `&&` returns the left operand itself when it's falsy — not `false`. React renders numbers (including `0`), so `0` shows up as literal text on the page. Only `false`, `null`, `undefined`, and `true` are silently skipped by React.
