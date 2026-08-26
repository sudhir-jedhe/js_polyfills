*** copy 05-lazy-initial-state.md ***

# Lazy Initial State — `expensiveInit` Only Runs Once, on First Mount

```jsx
function Cache() {
  const [data, setData] = React.useState(() => expensiveInit());
  return <pre>{JSON.stringify(data)}</pre>;
}
function expensiveInit() {
  console.log('computing initial state'); // logs once, not on every render
  return { loadedAt: Date.now() };
}
```
