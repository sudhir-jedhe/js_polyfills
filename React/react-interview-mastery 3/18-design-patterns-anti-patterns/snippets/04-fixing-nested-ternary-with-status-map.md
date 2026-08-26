# Fixing a Nested Ternary with a Status-to-Component Map

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
