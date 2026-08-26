*** copy 02-usecallback-basics.md ***

# useCallback: Caching a Function Reference

`useCallback(fn, deps)` returns the *same function reference* across renders as long as `deps` haven't changed, instead of creating a brand-new function every render (which is what happens by default — every render of a component recreates every function defined in its body).

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // stable reference forever

  return <ExpensiveChild onClick={handleClick} />;
}
```

`useCallback(fn, deps)` is literally equivalent to `useMemo(() => fn, deps)` — it's a convenience wrapper for the specific "memoize a function" case. Anywhere you'd write `useMemo(() => someFunction, deps)`, `useCallback(someFunction, deps)` does the same thing with less ceremony.

## useMemo(() => fn, []) vs useCallback(fn, [])

They produce the exact same result — `useCallback` is defined internally as `useMemo(() => callback, deps)`. Use `useCallback` when memoizing a function (clearer intent, less boilerplate); reach for `useMemo` when memoizing any non-function value, or in the rare case you need to memoize a function as part of a larger returned object/array.

```jsx
function Demo() {
  const a = useCallback(() => console.log('a'), []);
  const b = useMemo(() => () => console.log('b'), []);
  // a and b behave identically: stable function reference across every re-render
  return <button onClick={a} onDoubleClick={b}>Click</button>;
}
```

Using `useMemo` to memoize a function works but reads as unconventional in review — most style guides and linters expect `useCallback` for that specific case.
