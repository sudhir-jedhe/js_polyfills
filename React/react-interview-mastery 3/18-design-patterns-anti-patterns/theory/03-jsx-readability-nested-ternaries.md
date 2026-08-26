# Anti-Pattern: Deeply Nested Ternaries in JSX

```jsx
// Before
return status === "loading" ? <Spinner /> : status === "error" ? <ErrorMsg /> : status === "empty" ? <EmptyState /> : <List items={items} />;

// After
if (status === "loading") return <Spinner />;
if (status === "error") return <ErrorMsg />;
if (status === "empty") return <EmptyState />;
return <List items={items} />;
```

Nested ternaries are hard to scan and easy to get the precedence wrong on. Early returns, or a small lookup object, read far better:

```jsx
const STATUS_VIEWS = {
  loading: <Spinner />,
  error: <ErrorMsg />,
  empty: <EmptyState />,
};

function StatusView({ status, items }) {
  return STATUS_VIEWS[status] ?? <List items={items} />;
}
```

## Why this matters beyond style

A nested ternary's final `else` branch is a catch-all for anything that isn't explicitly matched — this can silently mislabel an unrecognized/unexpected value instead of surfacing that it's unexpected. For example, a status badge with a ternary chain ending in `"Inactive"` as the fallback will render "Inactive" for a genuinely unknown status like `"unknown"`, hiding a logic gap that an explicit `switch` or lookup table with a clear default would make more visible.

This is the practical reason nested ternaries are flagged in review, not just readability: they hide missing cases as easily as they hide correct ones.
