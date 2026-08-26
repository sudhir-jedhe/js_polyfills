*** copy 06-early-returns-for-multi-state.md ***

# Snippet: Multiple early returns for conditional rendering instead of nested ternaries

```jsx
function Status({ state }) {
  if (state === 'loading') return <Spinner />;
  if (state === 'error') return <ErrorMessage />;
  if (state === 'empty') return <EmptyState />;
  return <DataView />;
}
```
