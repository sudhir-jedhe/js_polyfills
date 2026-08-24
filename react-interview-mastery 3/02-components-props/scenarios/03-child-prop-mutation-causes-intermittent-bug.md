# Child Component's Prop Mutation Causes a Bug That Only Shows Up Intermittently

**Scenario:** You're debugging a shopping cart where the item count displayed in the header sometimes doesn't match the actual cart contents, and the bug is hard to reproduce — it seems to depend on which components happen to render in what order.

**Approach:** Look for a component mutating a props object directly instead of treating it as read-only, most likely a shared array or object being passed down and modified in place somewhere (e.g. `props.cartItems.push(newItem)` or `props.cartItems.sort(...)` inside a child). Because JS objects/arrays are passed by reference, such a mutation silently corrupts the same data other components (like the header) are also holding a reference to, without going through `setState` — so React doesn't know to re-render everyone consistently, producing timing-dependent inconsistencies. The fix is to audit every place that receives array/object props and ensure none of them mutate directly; always derive a new array/object and pass it up via a callback prop instead:

```jsx
// Wrong
function CartList({ items }) {
  items.sort((a, b) => a.price - b.price); // mutates the parent's array
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}

// Correct
function CartList({ items }) {
  const sorted = [...items].sort((a, b) => a.price - b.price); // new array, local only
  return <ul>{sorted.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```
