*** copy 03-referential-equality.md ***

# Why Referential Equality Matters

JavaScript compares objects and functions by reference, not by structural equality — `{} !== {}` and `(() => {}) !== (() => {})` even though they "look the same." This matters in two places React cares about deeply.

## 1. `React.memo`

A memoized component skips re-rendering if its props are shallowly equal to last time. If you pass an inline object or function as a prop, it's a *new reference* every render of the parent, so the shallow-equality check always fails and the memoization is defeated — `ExpensiveChild` re-renders every time regardless of `React.memo`.

```jsx
const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
  console.log('ExpensiveChild render');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {/* New arrow function every render defeats React.memo entirely */}
      <ExpensiveChild onClick={() => console.log('clicked')} />
    </>
  );
}
```

## 2. `useEffect` (and `useMemo`/`useCallback`) dependency arrays

If an object or function is listed as a dependency and it's recreated every render, the effect reruns every render too, regardless of whether anything meaningful actually changed.

```jsx
function Search({ query }) {
  const options = { caseSensitive: false }; // new object every render

  useEffect(() => {
    runSearch(query, options);
  }, [query, options]); // options is "new" every render → effect fires every render
}
```

## React.memo vs useEffect deps: same root cause

| Aspect | `React.memo` | `useEffect` dependency array |
|---|---|---|
| What it compares | All props, shallowly, by default | Only the values you explicitly list |
| Consequence of a "new reference every render" prop/dep | Component re-renders anyway (memo defeated) | Effect re-runs every render (cleanup + setup repeats) |
| Fix | Memoize the object/function/array passed as that prop | Memoize the object/function/array in the dependency list, or avoid depending on the whole object |

Both systems rely on the same underlying assumption: unchanged data should have unchanged references. The most common mistake in both cases is passing an inline object/array/function literal (`{}`, `[]`, `() => {}`) as a prop or dependency, which is guaranteed to be "new" on every render and defeats whatever equality check is downstream.
