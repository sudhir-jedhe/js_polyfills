# Output-Based: Does the displayed count update when a ref is mutated on click?

```jsx
function Counter() {
  const countRef = useRef(0);
  const [, forceRender] = useState(0);

  const handleClick = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };

  return (
    <div>
      <p>Displayed: {countRef.current}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

The user clicks the button 3 times. What does the console show, and what does "Displayed:" show on screen after each click?

**Answer:** The console logs `1`, `2`, `3` correctly. "Displayed:" stays at `0` on screen the entire time, never updating.

**Why:** Mutating `countRef.current` updates the value immediately (so `console.log` reads the fresh value), but it does not schedule a re-render. Since nothing else re-renders this component, the JSX showing `countRef.current` was only evaluated once, at the initial render, and never re-evaluated — it's frozen at `0` visually even though the underlying ref value is changing.
