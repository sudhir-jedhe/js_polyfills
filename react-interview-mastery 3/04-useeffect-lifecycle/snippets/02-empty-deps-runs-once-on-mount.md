# Empty Dependency Array — Runs Once, on Mount Only

```jsx
function MountLogger() {
  React.useEffect(() => {
    console.log('mounted');
  }, []);
  return <p>Loaded</p>;
}
```
