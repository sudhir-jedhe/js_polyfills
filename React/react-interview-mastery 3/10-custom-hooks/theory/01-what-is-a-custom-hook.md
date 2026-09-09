***  01-what-is-a-custom-hook.md ***

# What Makes Something a Custom Hook

A custom hook is just a regular JavaScript function that (1) calls one or more built-in hooks (`useState`, `useEffect`, `useRef`, etc.) or other custom hooks internally, and (2) is named starting with `use` by convention. That's it — there's no special React API for "declaring" a hook; it's purely a naming and usage convention that both React's linter and other developers rely on to know a function has hook-like behavior (stateful, order-sensitive, only callable from certain places).

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <>
      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'}</button>
      {isOpen && <div className="modal">Content</div>}
    </>
  );
}
```

`useToggle` isn't magic — it's a function that happens to call `useState`, and by naming it `useToggle`, React's ESLint plugin (`eslint-plugin-react-hooks`) knows to apply the Rules of Hooks to it and lint calls to `useState`/`useCallback` inside it correctly.

## When to extract a custom hook

When the same stateful logic (or a variant of it) is needed in more than one component, or when a single component's logic is complex enough that extracting it improves readability and testability, even if there's currently only one consumer. A useful heuristic: if you're copy-pasting a `useState` + `useEffect` combination between components, or a component's body has grown hard to scan because of interleaved unrelated concerns, that's usually a sign a custom hook extraction is overdue.
