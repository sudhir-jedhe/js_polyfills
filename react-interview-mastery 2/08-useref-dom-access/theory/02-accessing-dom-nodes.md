# Accessing DOM nodes

The most common use: attach a ref to a JSX element, and after the browser paints, `.current` points at the real DOM node.

```jsx
function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // runs after mount, DOM node exists by then
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
```

`inputRef.current` is `null` during the initial render (before the DOM exists) and gets set by React right after the commit phase, before effects run — which is exactly why DOM ref access belongs in `useEffect` (or an event handler), not directly in the render body.

Common DOM-ref use cases: focus management, reading layout (`getBoundingClientRect`), scrolling an element into view, integrating imperative third-party libraries (charting libraries, video players) that need a raw DOM node to mount into.
