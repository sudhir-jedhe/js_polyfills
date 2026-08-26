*** copy 07-avoiding-infinite-loop-with-primitive-deps.md ***

# Avoiding an Infinite Loop by Depending on Primitives, Not a Fresh Object Literal

```jsx
function SearchResults({ query, page }) {
  const [results, setResults] = React.useState([]);
  React.useEffect(() => {
    // built inside the effect, not passed in as an unstable dependency
    fetchResults({ query, page }).then(setResults);
  }, [query, page]);
  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>;
}
```
