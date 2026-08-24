# Building a Generic `<Table>` Component That Different Teams Want to Customize Differently

**Scenario:** You're building a shared `<Table>` component for a design system, and different consuming teams each want to customize the header, row rendering, and empty state differently — a single fixed prop API (`headerText`, `rowFormat`, `emptyMessage`) is turning into an unmanageable pile of narrow, single-purpose props.

**Approach:** Move from "data-in, fixed-markup-out" props to composition/render-based props for the parts that vary structurally, while keeping simple scalar props for things that are genuinely just values:

```jsx
function Table({ columns, data, renderEmpty, children }) {
  if (data.length === 0) {
    return renderEmpty ? renderEmpty() : <p>No data</p>;
  }
  return (
    <table>
      <thead>{children}</thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map(col => <td key={col.key}>{col.render(row)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// usage — each team supplies its own header markup and column renderers
<Table
  columns={[
    { key: 'name', render: row => <strong>{row.name}</strong> },
    { key: 'status', render: row => <StatusPill status={row.status} /> },
  ]}
  data={users}
  renderEmpty={() => <EmptyState icon="users" text="No users yet" />}
>
  <tr><th>Name</th><th>Status</th></tr>
</Table>
```

This keeps `Table`'s core prop surface (columns, data) simple while letting consumers inject custom markup for the parts that legitimately differ per use case, instead of the component trying to anticipate every formatting need with more scalar props.
