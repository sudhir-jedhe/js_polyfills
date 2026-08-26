*** copy 04-duplicate-inner-keys.md ***

# Output-Based: Duplicate keys in a nested `.map()`

```jsx
function Grid({ rows }) {
  return (
    <>
      {rows.map((row) => (
        <div key={row.id}>
          {row.cells.map((cell) => (
            <span key={row.id}>{cell.value}</span>
          ))}
        </div>
      ))}
    </>
  );
}
```

React logs a warning in the console. What is it, and is the app still functionally broken?

**Answer:** React warns about duplicate keys within the inner `.map()` (every `<span>` in a given row shares the same key: `row.id`). The app will likely misrender — cells within a row may not update correctly when their values change, though it won't crash.

**Why:** Each `.map()` call needs keys unique among its own siblings. The inner map is keyed by `row.id`, which is constant across all cells in that row, so React can't tell the cells apart. It should be keyed by `cell.id` instead.
