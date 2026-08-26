*** copy 03-search-filter-checkbox-sticks.md ***

# Scenario: Search-filtered list causes checkboxes to "stick" to the wrong row

You're building a multi-select table with a search box that filters visible rows. Users report that after typing a search term, checking a box, then clearing the search, a *different* row than the one they checked appears checked.

**Approach:** The filtered rows are being rendered with index-based keys, so filtering (which changes which items occupy which index) reassigns each row's component instance — and its local checkbox state — to whatever item now lands at that index:

```jsx
// Buggy: filtering changes indices, state sticks to position
{filteredRows.map((row, i) => (
  <Row key={i} row={row} />
))}
```

The fix, as usual, is a stable key from the data, and — more importantly for this case — lifting "checked" state out of the row component entirely into a parent-level `Set` of selected IDs, so the checked state is tied to the row's identity rather than to any component instance:

```jsx
function Table({ rows }) {
  const [selected, setSelected] = useState(new Set());
  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              <input
                type="checkbox"
                checked={selected.has(row.id)}
                onChange={() => toggle(row.id)}
              />
            </td>
            <td>{row.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

This removes the class of bug entirely — selection state now lives in a data structure keyed by id, not in ephemeral per-instance component state.
