***  03-click-outside-dropdown.md ***

# Problem: "Click outside to close" dropdown using a ref + document event listener

## Task

Build a dropdown menu that closes when the user clicks anywhere outside of it (but stays open when clicking inside it), implemented with a ref and a native `document` event listener — not a UI library.

## Solution

```jsx
import { useState, useRef, useEffect } from 'react';

function useClickOutside(onOutsideClick) {
  const ref = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      // If the click target is inside our tracked element, do nothing —
      // only clicks genuinely OUTSIDE the ref'd element should close it.
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick(event);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [onOutsideClick]);

  return ref;
}

function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);

  const containerRef = useClickOutside(() => setOpen(false));

  return (
    <div className="dropdown" ref={containerRef}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {label} {open ? '▲' : '▼'}
      </button>
      {open && <div className="dropdown-menu">{children}</div>}
    </div>
  );
}

function App() {
  return (
    <Dropdown label="Options">
      <button>Edit</button>
      <button>Duplicate</button>
      <button>Delete</button>
    </Dropdown>
  );
}

export default App;
```

## Why this works

- `containerRef` is attached to the outermost `<div>` wrapping both the toggle button and the menu, so `ref.current.contains(event.target)` is true for a click on the button, the menu, or anything inside either — only a click genuinely outside that whole subtree reaches `onOutsideClick`.
- The listener is attached to `document` (not the dropdown itself) via `addEventListener` inside a `useEffect`, because "outside" clicks by definition happen on elements the dropdown has no direct relationship with — there's no React event to attach that fires for arbitrary clicks elsewhere in the page.
- Using `mousedown` rather than `click` avoids a common bug: if the toggle button's own `onClick` (which opens the menu) and a `document` `click` listener (which would close it) both fire for the same click, ordering issues can cause the menu to immediately reopen or flicker. `mousedown` fires before React's synthetic `click`, sidestepping that race in the common case, though the `ref.current.contains()` check is what actually prevents the toggle button's own click from being treated as "outside" in either case.
- The effect's cleanup (`removeEventListener`) runs on every unmount/re-run, preventing the classic "stale native listener accumulating on every render" bug — since `onOutsideClick` is in the dependency array, if the parent passes a new inline function each render, the old listener is removed and a fresh one attached, keeping only one active at a time.
- This is a case where a ref is used for something React's declarative model genuinely can't express — "was this native DOM event's target inside a specific subtree" requires an imperative DOM query (`.contains()`) against a real node, not something derivable from props/state alone.
