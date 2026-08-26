*** copy 02-ref-mutation-does-not-rerender.md ***

# Snippet: Mutating a ref does NOT trigger a re-render

```jsx
// The displayed count won't change on click, even though clicks.current does.
function ClickCounterBroken() {
  const clicks = useRef(0);
  return (
    <button onClick={() => { clicks.current += 1; console.log(clicks.current); }}>
      Clicked {clicks.current} times (stale in UI)
    </button>
  );
}
```
