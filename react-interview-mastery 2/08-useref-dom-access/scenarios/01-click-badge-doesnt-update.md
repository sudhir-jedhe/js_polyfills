# Scenario: A "click count" badge doesn't update even though you can see the number is changing in devtools

You're building a button that shows how many times it's been clicked. You wired it up with `useRef` for the counter (to avoid "unnecessary re-renders," as a teammate suggested), but the number displayed never changes even though logging `ref.current` in the click handler shows it incrementing correctly.

**Approach:** This is a direct consequence of `useRef` mutations not scheduling re-renders. If the counter needs to be displayed, it needs to live in `useState`, full stop — there's no such thing as "avoiding re-renders" for a value that's supposed to visibly update; a re-render is exactly what needs to happen.

```jsx
// Broken: ref mutation never triggers a re-render, UI stays stale
function ClickCounter() {
  const clicks = useRef(0);
  return (
    <button onClick={() => { clicks.current += 1; }}>
      Clicked {clicks.current} times
    </button>
  );
}

// Fixed: use state for anything that needs to appear on screen
function ClickCounter() {
  const [clicks, setClicks] = useState(0);
  return (
    <button onClick={() => setClicks((c) => c + 1)}>
      Clicked {clicks} times
    </button>
  );
}
```

`useRef` is the right tool only for values the component needs to remember internally without that change being reflected in the rendered output by itself (e.g., "have I already logged this event," a debounce timer ID) — not for anything the user is meant to see update.
