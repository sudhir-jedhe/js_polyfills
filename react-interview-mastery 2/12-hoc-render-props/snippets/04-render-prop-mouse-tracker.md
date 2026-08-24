# Snippet: Render Prop Component Sharing Mouse Position Logic

```jsx
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {children(pos)}
    </div>
  );
}
// usage: <MouseTracker>{({ x, y }) => <p>{x}, {y}</p>}</MouseTracker>
```
