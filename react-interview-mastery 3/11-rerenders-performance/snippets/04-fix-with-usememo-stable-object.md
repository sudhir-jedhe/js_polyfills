# Snippet: Fixing It With useMemo for a Stable Object Reference

```jsx
function Parent() {
  const [tick, setTick] = useState(0);
  const style = useMemo(() => ({ color: 'red' }), []); // stable across renders
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>{tick}</button>
      <Box style={style} />
    </>
  );
}
```
