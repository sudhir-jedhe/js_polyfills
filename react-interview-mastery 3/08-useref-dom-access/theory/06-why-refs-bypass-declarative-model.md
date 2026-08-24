# Why refs are an escape hatch, not a substitute for state

Reading or writing DOM state via refs when the same thing could be expressed with props/state is generally discouraged, because it bypasses React's declarative model — the DOM becomes a second source of truth that has to be kept in sync manually, which is error-prone and hard to reason about compared to letting React derive the DOM from state. Refs for DOM access are meant for things React genuinely can't express declaratively (focus, scroll position, measuring layout, third-party imperative library integration), not as a general substitute for controlled state.

## Callback refs vs ref objects

A callback ref (`ref={(el) => {...}}`) is invoked by React with the DOM node (or class instance) when it's attached, and called again with `null` when it's detached (unmount, or the ref itself changes identity between renders). This makes callback refs useful for tracking dynamic collections of elements (e.g., a list of item refs keyed by id) where a single ref object wouldn't work, since you need per-item ref slots:

```jsx
function List({ items }) {
  const itemRefs = useRef([]);
  itemRefs.current = []; // reset every render so removed items don't leave stale entries

  return (
    <ul>
      {items.map((item, i) => (
        <li key={item.id} ref={(el) => (itemRefs.current[i] = el)}>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

Resetting `itemRefs.current = []` needs to happen on every render (not inside a `useEffect([])`) because the list of DOM nodes can change — items added/removed — and doing the reset during render (before the callback refs run) keeps the array in sync with the current `items` on every pass.
