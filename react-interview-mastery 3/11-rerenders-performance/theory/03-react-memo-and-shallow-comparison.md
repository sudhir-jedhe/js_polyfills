# `React.memo` and Its Shallow-Comparison Caveat

`React.memo(Component)` skips re-rendering a component if its props are shallowly equal to the previous render's props. "Shallow" means `Object.is` per prop — nested objects/arrays are compared by reference, not deep value.

```jsx
const Row = React.memo(function Row({ item, onSelect }) {
  console.log('Row render', item.id);
  return <li onClick={() => onSelect(item.id)}>{item.label}</li>;
});
```

This works great if `item` and `onSelect` are referentially stable across renders. It silently stops working the moment the parent passes a **new object, array, or function literal** each render — which is extremely common:

```jsx
function List({ items }) {
  // BUG: new function identity every render defeats Row's memo
  return items.map(item => (
    <Row key={item.id} item={item} onSelect={(id) => console.log(id)} />
  ));
}
```

Fix with `useCallback`/`useMemo` to stabilize the reference, or restructure so the callback doesn't need to be recreated (e.g., pass `id` and handle selection via event delegation or a stable dispatch function from `useReducer`).

## `React.memo` vs `useMemo` / `useCallback`

| Aspect | `React.memo` | `useMemo` / `useCallback` |
|---|---|---|
| What it does | Wraps a *component*, skips re-render if props are shallowly equal | Wraps a *value/function*, keeps the same reference across renders unless dependencies change |
| Where it's used | Around the component definition/export | Inside the parent that passes props down |
| Common mistake | Wrapping a component in `memo` but the parent still passes new object/array/function literals as props, so it never actually skips | Adding dependencies that change every render (e.g. an inline object) which defeats the memoization entirely |

Use `memo` on leaf/list-row components that render often with the same props; pair it with `useMemo`/`useCallback` on the parent to actually stabilize those props. Neither is useful alone if the other side isn't stable.

## When should you reach for `React.memo`, and when is it a waste of effort?

Reach for it on components that render frequently with genuinely stable props — typically leaf components or list rows where the parent re-renders often but a given row's data rarely changes. It's a waste on components that render cheaply anyway, or whose props are unstable references from the parent (you'd need `useMemo`/`useCallback` upstream too, which adds its own overhead) — measure with the Profiler first.

## Why doesn't `useCallback` alone guarantee a component avoids re-rendering?

`useCallback` only stabilizes the *function reference* passed as a prop — the child still needs to be wrapped in `React.memo` to actually skip re-rendering when that prop (and all others) is unchanged. Using `useCallback` without `memo` on the receiving component has no effect on whether that component re-renders.
