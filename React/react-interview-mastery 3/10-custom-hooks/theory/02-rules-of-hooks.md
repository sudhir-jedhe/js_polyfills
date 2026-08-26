*** copy 02-rules-of-hooks.md ***

# The Rules of Hooks

Two rules, enforced by convention + lint rule, not by the JS runtime itself:

1. **Only call hooks at the top level.** Never inside loops, conditionals, or nested functions.
2. **Only call hooks from React function components or other custom hooks.** Never from regular JS functions, class components, or outside the render flow.

```jsx
// Violates rule 1 — conditional hook call
function Bad({ show }) {
  if (show) {
    const [value, setValue] = useState(0); // breaks call order between renders
  }
}
```

## Why the rules exist

React tracks hook state by **call order**, not by variable name or any explicit identifier. Internally, each component instance has a linked list of "hook slots," and every render, React walks that list in the same sequence your hook calls appear in the function body, matching the first `useState` call this render to the first `useState` call last render, the second to the second, and so on.

If a hook call is conditionally skipped on some renders, every hook call *after* it shifts by one slot, and React ends up matching the wrong stored state to the wrong `useState` call — corrupting state silently or throwing "Rendered more hooks than during the previous render." This is why hooks can never live inside `if` blocks, loops, or be called conditionally — the *number and order* of hook calls must be identical on every render of a given component instance.

```jsx
function Counter({ skip }) {
  // if `skip` toggles between renders, call order changes and React desyncs state
  if (!skip) {
    const [count, setCount] = useState(0);
  }
  const [other, setOther] = useState('x'); // shifts slots when `skip` flips
}
```

## Why you can't call hooks inside event handlers or `.map()`

Both violate "only call hooks at the top level" — a hook called inside an event handler runs outside of React's render flow entirely (there's no render happening when the click fires), so there's no "hook slot" for React to match it against. A hook called inside `.map()` would be called a variable number of times depending on array length, which breaks the fixed call-order requirement the same way a conditional does.

## `eslint-plugin-react-hooks`

This is the official ESLint plugin that enforces the Rules of Hooks (`rules-of-hooks`) and flags incomplete/incorrect dependency arrays in `useEffect`/`useMemo`/`useCallback` (`exhaustive-deps`) at write time, rather than letting these bugs surface later as runtime crashes or subtle stale-state bugs. Because both classes of bugs are easy to introduce accidentally and hard to spot in review just by reading code, most teams treat this plugin as effectively mandatory rather than optional tooling.
