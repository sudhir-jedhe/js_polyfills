# Scenario: A Render-Prop Mouse Tracker Tanks Frame Rate on an Expensive Child

A component using the render-props pattern (`<MouseTracker>{(pos) => <Cursor {...pos}/>}</MouseTracker>`) is causing `Cursor` (a `memo`-wrapped, expensive-to-render SVG) to re-render on every single pixel of mouse movement, tanking frame rate. How do you fix this while keeping the render-props API?

**Approach:** The render-prop function itself is fine — the real issue is that `Cursor` receives a fresh position on every mouse-move event, which is legitimately supposed to update it. If the actual requirement is to throttle visual updates rather than track every pixel, throttle inside the provider:

```jsx
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef(null);

  const handleMove = useCallback((e) => {
    if (frame.current) return; // drop events until next animation frame
    frame.current = requestAnimationFrame(() => {
      setPos({ x: e.clientX, y: e.clientY });
      frame.current = null;
    });
  }, []);

  return <div onMouseMove={handleMove}>{children(pos)}</div>;
}
```

This caps `setPos` (and therefore `Cursor`'s re-render) to once per animation frame (~60fps) instead of once per raw mousemove event (which can fire hundreds of times per second), fixing the perceived jank without changing the render-props contract consumers already depend on.
