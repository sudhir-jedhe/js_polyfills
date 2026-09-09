***  02-missing-dependency-stale-total.md ***

# Output-Based: Missing Dependency Produces a Stale useMemo Result

```jsx
function List({ items, taxRate }) {
  const total = useMemo(() => {
    console.log('recomputing total');
    return items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate);
  }, [items]);

  return <p>{total.toFixed(2)}</p>;
}
```

`items` stays the same array reference across renders, but `taxRate` changes from `0.05` to `0.08`. Does "recomputing total" log, and is the displayed total correct?

**Answer:** "recomputing total" does not log (deps array only has `items`, unchanged), and the displayed total is stale — it still reflects the old `taxRate`.

**Why:** `taxRate` is used inside the memoized function but missing from the dependency array. `useMemo` only recomputes when a listed dependency changes; since `items` is unchanged, React returns the cached value from before, silently ignoring that `taxRate` changed. This is a classic missing-dependency bug — most lint configs with `eslint-plugin-react-hooks`'s `exhaustive-deps` rule would flag this.
