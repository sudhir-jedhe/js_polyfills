*** copy 04-state-immutability.md ***

# State Is Immutable — Never Mutate Directly

React detects state changes by comparing references (`Object.is`), not by deep-inspecting values. Mutating an array or object in place keeps the same reference, so React doesn't know anything changed and won't re-render:

```jsx
// Wrong
function Bad() {
  const [items, setItems] = React.useState([]);
  function addItem(item) {
    items.push(item);      // mutates in place, same reference
    setItems(items);       // React sees the same reference -> may skip re-render
  }
}

// Correct — always create a new reference
function Good() {
  const [items, setItems] = React.useState([]);
  function addItem(item) {
    setItems(prev => [...prev, item]);
  }
  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }
  function updateItem(id, patch) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)));
  }
}
```

This applies to objects too: `setUser(prev => ({ ...prev, name: 'New Name' }))`, never `user.name = 'New Name'; setUser(user)`.

## Mutating state vs. creating a new reference

| Aspect | Mutating in place (`items.push(x); setItems(items)`) | Creating a new reference (`setItems(prev => [...prev, x])`) |
|---|---|---|
| Triggers re-render | Not reliably — same reference may be skipped by `Object.is` check | Always — new reference is always detected as a change |
| Works with `React.memo`/`useMemo` elsewhere | Breaks reference-equality-based optimizations | Plays correctly with reference-equality checks |
| Debuggability | Hard to trace — DevTools history/undo can't diff mutated state | Easy — each state snapshot is a distinct, comparable object |

Always create new arrays/objects for state updates — spread syntax, `.map()`/`.filter()` (which return new arrays), or object spread. The common mistake is reaching for familiar mutating array methods (`push`, `splice`, `sort`, `reverse`) directly on state.
