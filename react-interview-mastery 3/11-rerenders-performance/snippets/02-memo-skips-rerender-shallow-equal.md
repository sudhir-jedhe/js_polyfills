# Snippet: React.memo Skips Re-Render When Props Are Shallowly Equal

```jsx
const Child = React.memo(function Child({ label }) {
  console.log('Child rendered');
  return <span>{label}</span>;
});
function Parent() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>tick: {tick}</button>
      <Child label="static" /> {/* now skips re-render — same primitive prop */}
    </>
  );
}
```
