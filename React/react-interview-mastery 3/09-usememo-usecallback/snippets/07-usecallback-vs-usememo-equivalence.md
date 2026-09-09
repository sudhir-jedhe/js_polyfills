***  07-usecallback-vs-usememo-equivalence.md ***

# Snippet: useCallback(fn, []) and useMemo(() => fn, []) Produce the Identical Reference

```jsx
function Demo() {
  const a = useCallback(() => console.log('a'), []);
  const b = useMemo(() => () => console.log('b'), []);
  // a and b behave identically: stable function reference across every re-render
  return <button onClick={a} onDoubleClick={b}>Click</button>;
}
```
