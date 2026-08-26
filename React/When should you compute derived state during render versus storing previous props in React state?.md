*** copy When should you compute derived state during render versus storing previous props in React state?.md ***

**Compute derived state during render** by default. Storing previous props in state to adjust state during render is a specialized pattern reserved only for when a value must be **independently editable by the user**, but needs to **partially reset or adapt** when an upstream prop changes.

---

### Core Distinction

```
Can the value be 100% computed from existing props & state?
   │
   ├── YES ──▶ Compute Directly During Render (Derived Value)
   │           └── (No extra state, no sync bugs, automatically up-to-date)
   │
   └── NO (User must be able to mutate/override the value) 
          │
          ├── Does the whole component reset on prop change?
          │      └── Use `key={prop}` at the call site
          │
          └── Must you preserve SOME local state while adjusting another?
                 └── Store previous prop in state & adjust during render

```

---

### Strategy 1: Compute Directly During Render (The Default)

If a value is entirely a deterministic function of incoming props or other state, **never duplicate it into state**. Calculate it on the fly during the render pass.

```tsx
function FilterableList({ items, filterQuery }: { items: Item[]; filterQuery: string }) {
  // ✅ Derived on every render with zero state synchronization
  const visibleItems = items.filter(item => 
    item.name.toLowerCase().includes(filterQuery.toLowerCase())
  );
  const totalCount = visibleItems.length;

  return (
    <div>
      <p>Showing {totalCount} items</p>
      <ul>{visibleItems.map(item => <li key={item.id}>{item.name}</li>)}</ul>
    </div>
  );
}

```

* **Why it's preferred:** Eliminates state desynchronization bugs, avoids re-render loops, and requires zero boilerplate.
* **When to memoize (`useMemo`):** Only if the transformation involves thousands of elements or expensive calculations that measurably degrade frame rates.

---

### Strategy 2: Storing Previous Props in State (Adjusting During Render)

This pattern is necessary when a component has **local state that the user can actively modify**, but that local state must conditionally reset or transform when a specific prop changes, **without unmounting the entire component**.

```tsx
function SelectionList({ items }: { items: Item[] }) {
  // 1. User can independently click and change selection
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prevItems, setPrevItems] = useState(items);

  // 2. Prop changed: adjust selection during render before painting
  if (items !== prevItems) {
    setPrevItems(items);
    // Keep selection if it still exists in the new list, otherwise reset to null
    if (!items.some(item => item.id === selectedId)) {
      setSelectedId(null);
    }
  }

  return (
    <ul>
      {items.map(item => (
        <li 
          key={item.id}
          className={selectedId === item.id ? 'active' : ''}
          onClick={() => setSelectedId(item.id)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}

```

* **Why not `key={items}`?** If `SelectionList` also contained an open dropdown, expanded accordion state, or an active input focus, resetting via `key` would destroy and remount the DOM, losing all unrelated user state and focus.
* **Why not `useEffect`?** `useEffect` runs *after* the browser paints the stale selection to the screen, causing a visible visual flash and a wasteful secondary commit pass.

---

### Side-by-Side Comparison

| Dimension                             | Compute Derived Value                                             | Store Prev Props & Adjust State                                                    |
| ------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Can user edit the value directly?** | **No.** Value is read-only based on inputs.                       | **Yes.** Value has a dedicated `useState` setter.                                  |
| **Performance**                       | Constant time (or $O(N)$ with calculation). Runs once per render. | React stops the current render pass and immediately restarts it with new state.    |
| **Component Subtree Impact**          | Children evaluate normally in a single pass.                      | Discards unfinished JSX and re-executes component function before painting.        |
| **State Footprint**                   | 0 extra state variables.                                          | 2 state variables (`prevProp` + target state).                                     |
| **Primary Risk**                      | Expensive calculations if unmemoized.                             | Infinite render loops if the condition (`prop !== prevProp`) is omitted or flawed. |

---

### Summary Checklist

1. **Calculate directly** if the UI state cannot be edited independently by the user (e.g., filtered arrays, formatted strings, counts, validation errors).
2. **Use `key={prop}**` if the entire component's state (all inputs, scroll, focus) should reset when a parent entity changes (e.g., switching from `userId="1"` to `userId="2"`).
3. **Store previous props in state** only when you must selectively reset or adapt *one* piece of mutable local state while keeping the rest of the component tree mounted and intact.
