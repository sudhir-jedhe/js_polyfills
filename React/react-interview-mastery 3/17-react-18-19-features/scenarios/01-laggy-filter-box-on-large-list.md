# Typing in a Filter Box Feels Laggy on a Large List

You're building a table with 10,000 rows and a text filter above it. Users report that every keystroke causes a visible stutter before the character appears in the input.

**Approach:** The filtering/re-render of the large list is happening synchronously in the same update as the input's own state change, blocking the input's repaint. Split them: keep the input's own state update urgent, and mark the derived, expensive list update as a transition (or use `useDeferredValue` on the filter text feeding the list).

```jsx
function FilterableTable({ rows }) {
  const [filterText, setFilterText] = useState("");
  const deferredFilter = useDeferredValue(filterText);

  const visibleRows = useMemo(
    () => rows.filter((r) => r.name.includes(deferredFilter)),
    [rows, deferredFilter]
  );

  const isStale = filterText !== deferredFilter;

  return (
    <div>
      <input
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <Table rows={visibleRows} style={{ opacity: isStale ? 0.5 : 1 }} />
    </div>
  );
}
```

`filterText` updates immediately so the input never lags; `deferredFilter` trails behind slightly during heavy renders, and React prioritizes keeping the UI responsive over updating the table instantly.
