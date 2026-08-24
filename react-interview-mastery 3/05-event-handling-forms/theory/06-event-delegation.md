# Event delegation and `stopPropagation`

React doesn't attach a separate native listener to every DOM element with an `onClick` etc. — since React 17, it attaches one listener per event type at the root container the app is rendered into (previously it was on `document`), and dispatches synthetic events to the right component by walking the React tree. This is an internal optimization, but it has a visible consequence: `event.stopPropagation()` on a synthetic event stops the event from reaching other *React* handlers up the tree, but because delegation happens at the root, the underlying native event still bubbles through actual DOM ancestors before React's delegated listener even processes it — so a native (non-React) listener attached directly to a DOM ancestor via `addEventListener` can still see the event even if a React child called `stopPropagation()`.

```jsx
function App() {
  const divRef = React.useRef(null);
  React.useEffect(() => {
    divRef.current.addEventListener('click', () => console.log('native listener fired'));
  }, []);

  function handleInnerClick(e) {
    e.stopPropagation(); // stops React's outer onClick, NOT the native listener above
  }

  return (
    <div ref={divRef}>
      <button onClick={handleInnerClick}>Click me</button>
    </div>
  );
}
```
