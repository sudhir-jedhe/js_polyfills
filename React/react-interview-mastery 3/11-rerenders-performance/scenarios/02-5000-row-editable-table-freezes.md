# Scenario: A 5,000-Row Editable Table Freezes the Browser Tab

Product wants an editable table with 5,000 rows. Currently it's `data.map(row => <TableRow ... />)` and the browser tab freezes on load and scroll is janky. What do you do?

**Approach:** 5,000 real DOM rows is the actual problem, not re-render logic. Reach for virtualization:

```jsx
import { FixedSizeList as List } from 'react-window';

function BigTable({ rows }) {
  const Row = ({ index, style }) => (
    <div style={style} className="table-row">
      {rows[index].name} — {rows[index].value}
    </div>
  );
  return (
    <List height={600} width="100%" itemCount={rows.length} itemSize={35}>
      {Row}
    </List>
  );
}
```

Only the ~20 rows visible in the 600px viewport (plus overscan) mount at once; scrolling swaps content instead of growing the DOM. If rows are editable, keep the "is this row being edited" state either in the row data itself (keyed by row id) or in a `Set` of editing IDs at the parent level — not in local component state, since virtualized rows unmount/remount as they scroll out and back into the buffer.
