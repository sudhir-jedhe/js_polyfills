# Scenario: An Expensive Chart Re-Renders on Every Parent Re-Render Despite React.memo

You're building a dashboard where a `<RevenueChart data={revenueData} options={chartOptions} />` component does a heavy client-side aggregation of `data` before rendering, wrapped in `React.memo`. Despite that, it still re-processes and re-renders every time the parent dashboard updates (e.g., when an unrelated filter dropdown's open/closed state changes).

**Approach:** Audit how `revenueData` and `chartOptions` are produced in the parent — if they're computed inline on every render (e.g., `data={rawData.map(...)}` or `options={{ theme: 'dark' }}` directly in JSX), they're new references every time, defeating `React.memo` regardless of the internal aggregation logic:

```jsx
function Dashboard({ rawData, isDropdownOpen }) {
  // Buggy: new array/object every render, defeats RevenueChart's React.memo
  return (
    <RevenueChart
      data={rawData.map((d) => ({ month: d.month, total: d.amount }))}
      options={{ theme: 'dark' }}
    />
  );
}

function Dashboard({ rawData, isDropdownOpen }) {
  const data = useMemo(
    () => rawData.map((d) => ({ month: d.month, total: d.amount })),
    [rawData]
  );
  const options = useMemo(() => ({ theme: 'dark' }), []); // truly constant, memoize once

  return <RevenueChart data={data} options={options} />;
}
```

Additionally, move the heavy aggregation itself inside `RevenueChart` behind its own `useMemo` keyed on `data`, so even if `RevenueChart` does re-render for a legitimate prop change unrelated to `data`, the expensive aggregation isn't redone unless `data` specifically changed.
