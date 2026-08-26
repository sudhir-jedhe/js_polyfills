*** copy 02-props-are-read-only.md ***

# Props Are Read-Only

Props flow one direction: parent to child. A component must never mutate its own `props` object — React relies on this immutability contract to know when it's safe to bail out of re-rendering (e.g. with `React.memo`, covered elsewhere). Mutating props directly doesn't trigger a re-render anyway, since React only reacts to `setState`/`useState` calls, so it just produces silent bugs:

```jsx
// Wrong — never do this
function Bad(props) {
  props.items.push('new'); // mutates the parent's array in place
  return <ul>{props.items.map(i => <li key={i}>{i}</li>)}</ul>;
}
```

If a child needs to change something driven by a prop, it should call a callback passed down as a prop (e.g. `onChange`), letting the *owner* of that state update it — this is "lifting state up," covered in the `03-state-usestate` topic.

## Why this matters even when nothing "breaks" visibly

Because objects and arrays are passed by reference, mutating a prop directly modifies the same object the parent (and any other component holding a reference to it) is looking at — even though no `setState` call happened. This means the mutation *is* visible elsewhere, just not through React's normal re-render mechanism, which produces exactly the kind of "how did this change without anyone calling setState" bug that's hard to trace. It also breaks any component further up the tree relying on reference-equality checks (`React.memo`, `useMemo`/`useCallback` dependency comparisons): if the same object reference is mutated in place, those checks see "no change" and skip work that should have happened.
