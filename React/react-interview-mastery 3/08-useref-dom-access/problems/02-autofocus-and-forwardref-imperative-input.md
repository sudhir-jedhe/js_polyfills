***  02-autofocus-and-forwardref-imperative-input.md ***

# Problem: Auto-focus-on-mount input, plus a `forwardRef` custom input exposing `.focus()` via `useImperativeHandle`

## Task

Build two pieces: (1) a plain input that auto-focuses when it mounts, and (2) a reusable `CustomInput` component, wrapped in `forwardRef`, that exposes only a `.focus()` method to its parent via `useImperativeHandle` — not the raw DOM node.

## Solution

```jsx
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Part 1 — simple auto-focus on mount
function AutoFocusInput(props) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // DOM node is guaranteed to exist post-commit
  }, []);

  return <input ref={inputRef} {...props} />;
}

// Part 2 — a reusable component exposing a curated imperative API,
// not the raw <input> element itself.
const CustomInput = forwardRef(function CustomInput({ label, ...inputProps }, ref) {
  const innerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current.focus(),
    clear: () => {
      innerRef.current.value = '';
    },
  }));

  return (
    <label className="custom-input">
      {label}
      <input ref={innerRef} {...inputProps} />
    </label>
  );
});

// Usage: a form that auto-focuses its first field and lets a "Clear all"
// button reset a field it doesn't otherwise control.
function ContactForm() {
  const nameFieldRef = useRef(null);

  function handleClear() {
    nameFieldRef.current.clear();
    nameFieldRef.current.focus();
  }

  return (
    <form>
      <AutoFocusInput placeholder="Search…" aria-label="Search" />
      <CustomInput ref={nameFieldRef} label="Name" placeholder="Your name" />
      <button type="button" onClick={handleClear}>
        Clear name
      </button>
    </form>
  );
}

export default ContactForm;
```

## Why this works

- `AutoFocusInput` calls `.focus()` inside `useEffect` with an empty dependency array, so it runs exactly once, right after the DOM has committed and the real `<input>` node exists — calling `.focus()` directly in the render body would fail because `inputRef.current` is still `null` during render.
- `CustomInput` is wrapped in `forwardRef` because plain function components don't accept `ref` as a prop by default — without it, `<CustomInput ref={nameFieldRef} />` would silently fail to attach anything and log a console warning.
- `useImperativeHandle` replaces what `nameFieldRef.current` resolves to from the parent's perspective: instead of the raw `<input>` DOM node (which plain `ref={innerRef}` forwarding would expose), the parent only ever sees `{ focus, clear }`. This means `ContactForm` can call `nameFieldRef.current.focus()` and `.clear()`, but can't reach into `CustomInput`'s internal markup (e.g., can't read `.value` directly or restyle the input from outside) — the component controls its own encapsulation.
- `handleClear` demonstrates why this pattern exists: it's genuinely imperative behavior (reset + refocus a specific field) that doesn't map cleanly onto passing new props, which is exactly the kind of use case `useImperativeHandle` is meant for, used sparingly rather than as a general parent-child communication mechanism.
