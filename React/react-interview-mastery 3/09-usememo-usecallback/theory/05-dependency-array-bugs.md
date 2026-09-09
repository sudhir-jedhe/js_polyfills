***  05-dependency-array-bugs.md ***

# Classic Dependency-Array Bugs

## Missing a dependency

Using a value inside the memoized function/computation without listing it, so the cached result goes stale:

```jsx
function Cart({ items, taxRate }) {
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate),
    [items] // BUG: taxRate is used but not listed — total won't update when tax rate changes
  );
}
```

The fix is to list every value the memoized function reads:

```jsx
function Cart({ items, taxRate }) {
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate),
    [items, taxRate] // both used, both listed
  );
  return <p>Total: {total.toFixed(2)}</p>;
}
```

The `eslint-plugin-react-hooks` `exhaustive-deps` rule catches most of these automatically and should be treated as a strong signal, not a suggestion to silence.

## Depending on something that changes every render

An inline object/array/function created fresh each render defeats memoization entirely by forcing recomputation every render anyway:

```jsx
function SearchPanel({ query }) {
  const options = { caseSensitive: false }; // new object every render

  const results = useMemo(() => {
    console.log('searching');
    return search(query, options);
  }, [query, options]); // options is "new" every render → useMemo never actually caches anything
}
```

The fix is to hoist constant objects outside the component, or wrap them in their own `useMemo`.

## Stale closures inside useCallback

Wrapping a callback in `useCallback` with an incomplete dependency array captures old values from whichever render it was last recreated on — the same root cause as any stale closure:

```jsx
function Form() {
  const [value, setValue] = useState('');
  const handleSubmit = useCallback(() => {
    console.log(value); // always logs '' — closure captured value from mount
  }, []); // should be [value]
}
```
