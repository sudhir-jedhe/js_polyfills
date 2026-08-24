# Anti-Pattern: Mutating State Directly, and Index-as-Key

Two of the most common React bugs share a root cause: React relies on *reference* and *identity* to know what changed. Mutating state breaks reference-based change detection; using array index as a key breaks identity-based reconciliation. They're grouped here because they're both "React doesn't see what you think it sees" bugs.

## Mutating state directly

```jsx
// Before — mutates the array in place, React doesn't see a change
function addItem(item) {
  items.push(item);
  setItems(items); // same reference, no re-render guaranteed
}

// After — new array, new reference
function addItem(item) {
  setItems([...items, item]);
}
```

React compares state by reference (`Object.is`) to decide whether to re-render. Mutating and passing back the same reference can silently fail to trigger updates, or cause bugs when parts of the app assumed the old array was immutable. This isn't just a style nit — the fix is always to create a new reference (spread into a new array/object) so React's comparison correctly detects the change. Correctness shouldn't hinge on React's internal scheduling details deciding to re-render anyway; assume it won't.

For nested objects, spread each level you're changing:

```jsx
function updateAddress(setUser, city) {
  setUser((prev) => ({
    ...prev,
    address: { ...prev.address, city },
  }));
}
```

## Array index as key

```jsx
// Before — breaks on reorder/insert/delete
{items.map((item, i) => <Item key={i} {...item} />)}

// After — stable identity tied to the data
{items.map((item) => <Item key={item.id} {...item} />)}
```

React uses `key` to match elements across renders to the correct component instance. When a list is reordered, filtered, or has items inserted/removed, index-based keys cause React to associate the wrong data with an existing DOM node/component instance, since the index no longer corresponds to the same logical item. This shows up as bugs like local state (a typed input value, an open/closed toggle) sticking to the wrong row after a reorder.

| Aspect | Index as key | Stable ID as key |
|---|---|---|
| Correctness on reorder/insert/delete | Breaks — state and DOM get misattributed to the wrong item | Correct — React tracks each item by its actual identity |
| Performance | Can look "fine" for static, append-only lists | Always correct, and lets React avoid unnecessary DOM node recreation for unaffected items |
| When index is acceptable | List is static, never reordered/filtered/sorted, and items have no internal state | Any dynamic list — the general default |
| Common mistake | Using index just because the item object doesn't have an obvious `id` field, instead of generating one | Regenerating a "unique" key every render (e.g., `Math.random()`), which defeats keys entirely by making everything look new on every render |

Index-as-key is only safe when the list is static — never reordered, filtered, sorted, or has items inserted/removed in the middle — and the items have no internal state tied to their identity. In that narrow case, index and identity are equivalent, so there's no correctness risk, though reaching for a stable ID is still the safer default habit.
