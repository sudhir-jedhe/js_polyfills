*** copy 05-native-listener-vs-synthetic-stop-propagation.md ***

# Output-Based: Does a native `document.addEventListener` still fire after synthetic `stopPropagation()`?

```jsx
function App() {
  const divRef = React.useRef(null);
  React.useEffect(() => {
    divRef.current.addEventListener('click', () => console.log('native listener fired'));
  }, []);

  function handleInnerClick(e) {
    e.stopPropagation();
  }

  return (
    <div ref={divRef}>
      <button onClick={handleInnerClick}>Click me</button>
    </div>
  );
}
```

**Answer:** Yes, `native listener fired` still logs when the button is clicked, even though `stopPropagation()` was called in the React handler.

**Why:** `event.stopPropagation()` on a React SyntheticEvent stops propagation through React's synthetic event system (delegated from the root), but the actual native DOM click event still bubbles through the real DOM tree the normal way before/independent of React's delegated dispatch. A listener attached directly via `addEventListener` on an actual DOM ancestor sees the native bubbling event regardless of what React's synthetic `stopPropagation` did.
