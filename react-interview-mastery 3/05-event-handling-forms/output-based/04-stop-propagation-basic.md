# Output-Based: What's logged when the inner button is clicked?

```jsx
function App() {
  function handleOuterClick() {
    console.log('outer clicked');
  }
  function handleInnerClick(e) {
    e.stopPropagation();
    console.log('inner clicked');
  }
  return (
    <div onClick={handleOuterClick}>
      <button onClick={handleInnerClick}>Click me</button>
    </div>
  );
}
```

**Answer:** Only `inner clicked` logs — `outer clicked` does not.

**Why:** `event.stopPropagation()` on the synthetic event stops the event from propagating to other React-registered handlers further up the component tree, including the outer `div`'s `onClick`. Even though React internally delegates listeners at the root, from the perspective of application code this behaves exactly like normal DOM bubbling being stopped — the outer handler simply never fires.
