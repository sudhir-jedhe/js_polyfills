# Scenario: A Data Grid With 10,000 Rows Lags on Every Keystroke in an Unrelated Search Box

You're building a dashboard with a large sortable/filterable data grid and, separately, a global search box in the header. Typing in the header search box causes the entire page — including the unrelated grid — to noticeably lag on every keystroke.

**Approach:** The header search state likely lives in a common ancestor of both the search box and the grid, so every keystroke re-renders that ancestor and, by default, every descendant — including the grid, which re-sorts/re-filters its 10,000 rows from scratch on every render even though its own inputs haven't changed. Fix with `useMemo` around the grid's actual expensive computation, keyed only on the grid's own relevant inputs:

```jsx
function DataGrid({ rows, sortKey, filterText }) {
  const processedRows = useMemo(() => {
    const filtered = rows.filter((r) => r.name.includes(filterText));
    return filtered.sort((a, b) => a[sortKey] - b[sortKey]);
  }, [rows, sortKey, filterText]); // NOT dependent on the unrelated header search state

  return <Table rows={processedRows} />;
}
```

If `DataGrid` itself is also expensive to re-render (not just the sort), additionally wrap it in `React.memo` and ensure `rows`/`sortKey`/`filterText` are referentially stable across the header's re-renders — otherwise `React.memo` won't help since new prop references would still force a re-render even with unchanged data.
