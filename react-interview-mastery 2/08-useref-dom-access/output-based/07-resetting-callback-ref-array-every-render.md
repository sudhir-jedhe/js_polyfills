# Output-Based: Why must a callback-ref array be reset every render, not just once?

```jsx
function List({ items }) {
  const itemRefs = useRef([]);
  itemRefs.current = []; // reset every render

  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={item.id}
          ref={(el) => (itemRefs.current[i] = el)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

Why does `itemRefs.current = []` need to run on every render, and what would break if it were inside a `useEffect` with an empty dependency array instead?

**Answer:** It needs to run every render because the list of DOM nodes can change (items added/removed), and resetting the array during render (before the callback refs run) ensures stale entries from removed items don't linger. If it were in a `useEffect([])`, it would only reset once on mount — after that, removed items would leave stale `null`/dangling entries mixed in with valid ones as the array's length and indices drift out of sync with `items`.

**Why:** Callback refs like `ref={(el) => ...}` run during the commit phase for every element that mounts, updates its ref, or unmounts (called with `null` on unmount/ref change). Resetting the array right before that at the top of the render body (not in an effect) keeps `itemRefs.current` in sync with the current `items` array on every pass.
