# Snippet: React.memo Defeated by an Inline Object Prop

```jsx
const Box = React.memo(function Box({ style }) {
  console.log('Box rendered');
  return <div style={style}>content</div>;
});
function Parent() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <button onClick={() => setTick(t => t + 1)}>{tick}</button>
      {/* new {} literal every render -> memo never skips */}
      <Box style={{ color: 'red' }} />
    </>
  );
}
```
