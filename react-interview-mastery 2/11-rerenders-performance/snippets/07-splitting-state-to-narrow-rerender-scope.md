# Snippet: Splitting State Into a Child Component to Narrow Re-Render Scope

```jsx
// Before: SearchBox state lives in a big Parent, re-rendering everything below on each keystroke.
// After: isolate the input's state in its own leaf component.
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
function Page() {
  return (
    <>
      <SearchBox /> {/* keystrokes only re-render this component */}
      <ExpensiveDashboard />
    </>
  );
}
```
