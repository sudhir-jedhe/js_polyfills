# Output-Based: What Logs When the Button Is Clicked Once?

```jsx
function Parent() {
  const [n, setN] = useState(0);
  console.log('Parent render');
  return (
    <div>
      <button onClick={() => setN(n + 1)}>inc</button>
      <MemoChild n={n} />
    </div>
  );
}
const MemoChild = React.memo(function MemoChild({ n }) {
  console.log('MemoChild render', n);
  return <p>{n}</p>;
});
```
**Answer:** `"Parent render"` then `"MemoChild render 1"`.

**Why:** `n` is a primitive, so it's compared by value under `Object.is`. It changed from `0` to `1`, so `memo` correctly lets the re-render through. This is the "happy path" for `memo` — primitive props.
