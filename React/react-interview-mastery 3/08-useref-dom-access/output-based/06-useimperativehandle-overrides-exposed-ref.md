***  06-useimperativehandle-overrides-exposed-ref.md ***

# Output-Based: What does `ref.current` print when the child uses `useImperativeHandle`?

```jsx
const Fancy = forwardRef(function Fancy(props, ref) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current.focus(),
  }));
  return <input ref={innerRef} />;
});

function App() {
  const ref = useRef(null);
  useEffect(() => {
    console.log(ref.current);
  }, []);
  return <Fancy ref={ref} />;
}
```

What does `console.log(ref.current)` print — the DOM `<input>` element, or something else?

**Answer:** It prints an object `{ focus: [Function] }` — not the raw `<input>` DOM node.

**Why:** `useImperativeHandle` overrides what the forwarded ref exposes to the parent. Instead of `ref.current` being the actual DOM node (which is what plain `ref={innerRef}` forwarding would give), it's the object returned by the `useImperativeHandle` factory function — here, just a `focus` method. The parent has no direct access to the underlying `<input>` unless it's explicitly exposed.
