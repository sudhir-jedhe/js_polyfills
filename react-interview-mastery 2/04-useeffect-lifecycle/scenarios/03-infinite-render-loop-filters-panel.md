# Infinite Render Loop Crashes a Filters Panel

**Scenario:** You're building a filters panel that fetches results based on a filters object, and the app hangs/crashes the tab shortly after the panel mounts.

**Approach:** Classic infinite-loop signature: an effect that both depends on an object/array and also (directly or indirectly) causes that object to be recreated on every render. Trace the dependency to find where a new reference is being created each render:

```jsx
// Bug: `filters` object literal recreated every render -> effect always "changes" -> refetch -> re-render -> loop
function FilterPanel({ category, sortBy }) {
  const filters = { category, sortBy }; // new reference every render
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    fetchResults(filters).then(setResults);
  }, [filters]); // always different reference

  return <ResultsList results={results} />;
}

// Fixed: depend on the primitive values instead of the object wrapper
function FilterPanel({ category, sortBy }) {
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    fetchResults({ category, sortBy }).then(setResults);
  }, [category, sortBy]); // primitives compare by value, stable across renders unless actually changed

  return <ResultsList results={results} />;
}
```

If the object genuinely needs to be constructed outside the effect (e.g., shared with other logic), wrap it in `useMemo(() => ({ category, sortBy }), [category, sortBy])` instead of depending on primitives directly — but depending on primitives is simpler and preferred when possible.
