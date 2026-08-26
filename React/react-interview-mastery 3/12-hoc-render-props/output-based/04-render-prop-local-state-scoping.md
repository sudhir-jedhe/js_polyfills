# Output-Based: What Does Clicking the Toggle Button Log, and in What Order?

```jsx
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  console.log('Toggle render, on =', on);
  return children({ on, toggle: () => setOn(o => !o) });
}
function App() {
  console.log('App render');
  return (
    <Toggle>
      {({ on, toggle }) => {
        console.log('render prop function called, on =', on);
        return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
      }}
    </Toggle>
  );
}
```
**Answer:** On initial mount: `"App render"`, `"Toggle render, on = false"`, `"render prop function called, on = false"`. After one click: only `"Toggle render, on = true"` and `"render prop function called, on = true"` — `"App render"` does not log again.

**Why:** `setOn` is state local to `Toggle`, so only `Toggle` re-renders (and the children function it calls, since that function is invoked fresh — it's not a separate component that could be skipped). `App` itself never re-renders because none of its own state changed and nothing forces it to.
