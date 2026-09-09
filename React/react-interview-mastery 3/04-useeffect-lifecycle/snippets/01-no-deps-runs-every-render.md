***  01-no-deps-runs-every-render.md ***

# Effect With No Dependency Array — Runs After Every Render

```jsx
function RenderLogger() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    console.log('rendered');
  });
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```
