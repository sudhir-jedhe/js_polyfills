*** copy 06-lifting-state-up-for-siblings.md ***

# Lifting State Up So Two Siblings Stay in Sync

```jsx
function Parent() {
  const [query, setQuery] = React.useState('');
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ResultsCount query={query} />
    </>
  );
}
function SearchInput({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
function ResultsCount({ query }) {
  return <p>Searching for: "{query}"</p>;
}
```
