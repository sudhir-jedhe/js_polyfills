# Output-Based: React 18 Batches Multiple `setState` Calls

```jsx
function Parent() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  console.log('render');
  function handleClick() {
    setA(a + 1);
    setB(b + 1);
  }
  return <button onClick={handleClick}>{a}-{b}</button>;
}
```
Two clicks in a row on the same button (batched in one event handler) — how many `Parent` renders per click?

**Answer:** One additional `"render"` log per click (not two).

**Why:** React 18 batches all state updates that occur within a single event handler (and now even inside promises/timeouts by default), producing a single re-render that applies both `setA` and `setB` together.
