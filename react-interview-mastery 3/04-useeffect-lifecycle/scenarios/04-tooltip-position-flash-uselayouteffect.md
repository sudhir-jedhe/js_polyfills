# Tooltip Briefly Appears in the Wrong Position Before Snapping Into Place

**Scenario:** You're building a tooltip that measures its own size to position itself above a trigger element, but users report a visible flash where it appears at position `(0, 0)` for a frame before jumping to the correct spot.

**Approach:** The positioning logic is running in `useEffect`, which fires *after* the browser has already painted the initial (wrong) position — hence the visible flash. Switch to `useLayoutEffect`, which runs before paint, so the correct position is calculated and applied before the user ever sees the wrong one:

```jsx
function Tooltip({ targetRef, children }) {
  const tooltipRef = React.useRef(null);
  const [style, setStyle] = React.useState({ top: 0, left: 0 });

  React.useLayoutEffect(() => {
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setStyle({
      top: targetRect.top - tooltipRect.height - 8,
      left: targetRect.left,
    });
  }, [targetRef]);

  return (
    <div ref={tooltipRef} style={{ position: 'fixed', ...style }}>
      {children}
    </div>
  );
}
```

`useLayoutEffect` is exactly for this class of bug — anything involving DOM measurement followed by a synchronous visual correction before the frame is shown to the user.
