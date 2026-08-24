# `useState` Mechanics

`useState(initialValue)` returns a pair: the current value and a setter function. Each call to the setter schedules a re-render with the new value:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`initialValue` is only used on the *first* render ever — on every subsequent render, React ignores the argument and returns whatever the current state is. State is preserved across re-renders of the same component instance, and reset when the component unmounts and a fresh instance mounts (or when its `key` changes, forcing React to treat it as a new instance).

## What React actually returns and how it's used

The standard idiom is array destructuring with descriptive names: `const [count, setCount] = useState(0)`. Calling the setter schedules a re-render of the component with the new value; the state itself persists across re-renders of the same component instance, tied to that instance's position/identity in the tree, not to the variable name you happened to destructure it into.

If you call `setCount(5)` when `count` is already `5`, the component does **not** re-render by default — React bails out of re-rendering if the new state is reference-equal (`Object.is`) to the current state. This applies to primitives naturally (`5 === 5`) and is a built-in optimization to avoid redundant render work. Note this bailout doesn't apply to objects/arrays unless the reference itself is literally unchanged (see `04-state-immutability.md`).

## Hooks must be called unconditionally

`useState` (like all hooks) must be called in the exact same order on every render — unconditionally at the top level of the component, never inside conditions, loops, or nested functions. Calling it conditionally breaks React's internal mapping of hook calls to state slots between renders, causing state to become misaligned or React to throw an error.
