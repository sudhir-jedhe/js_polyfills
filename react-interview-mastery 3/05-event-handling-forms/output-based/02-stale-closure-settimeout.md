# Output-Based: What logs three seconds after clicking, if the button was clicked when `count` was `2`?

```jsx
function DelayedLog() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setTimeout(() => {
      console.log('count at click time:', count);
    }, 3000);
  }
  return (
    <>
      <button onClick={handleClick}>Schedule log</button>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </>
  );
}
```

**Answer:** `count at click time: 2` — even if the user clicks the increment button several more times during those three seconds, changing the displayed count to 5, 6, etc.

**Why:** `handleClick` is a closure created during the render where `count` was `2`; the `setTimeout` callback captures that same closure. Even though `count` state has since changed (causing new renders with new closures for new `handleClick` calls), the *specific* timeout scheduled from that click keeps referencing the `count` value from its own render, unaffected by later state changes.
