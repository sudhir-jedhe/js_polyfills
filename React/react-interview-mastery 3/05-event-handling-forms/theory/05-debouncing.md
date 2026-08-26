*** copy 05-debouncing.md ***

# Debouncing input handlers

For expensive operations tied to typing (API calls, heavy filtering), debounce so the operation only fires after the user pauses:

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const id = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(id); // cancels the pending call if query changes again quickly
  }, [query, onSearch]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

The `useEffect` cleanup naturally implements debouncing here: every keystroke schedules a new timeout and cancels the previous one before it fires.
