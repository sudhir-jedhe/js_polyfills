# Snippet: Parent Re-Render Forces Child Re-Render Even With Unchanged Props

```jsx
function Parent() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>tick: {tick}</button>
      <Child label="static" />
    </>
  );
}
function Child({ label }) {
  console.log('Child rendered'); // fires every click, though label never changes
  return <span>{label}</span>;
}
```
