*** copy 03-reparsing-localstorage-blob-every-keystroke.md ***

# Search Page Re-Parses a Huge JSON Blob From `localStorage` on Every Keystroke, Causing Lag

**Scenario:** You're building a search page that seeds its initial filter state from a large cached JSON blob in localStorage, and profiling shows a noticeable parse/computation cost happening on every render, not just once at mount.

**Approach:** The initializer is almost certainly written as `useState(JSON.parse(localStorage.getItem('filters')))` — a plain function call passed as the argument, which JavaScript evaluates on every render regardless of whether `useState` will actually use the result. Switch to the lazy initializer form so React only invokes it once, on mount:

```jsx
function SearchPage() {
  // Bad: JSON.parse runs on every render even though only used once
  // const [filters, setFilters] = React.useState(JSON.parse(localStorage.getItem('filters') || '{}'));

  // Good: only parsed once, at mount
  const [filters, setFilters] = React.useState(() => {
    const raw = localStorage.getItem('filters');
    return raw ? JSON.parse(raw) : {};
  });

  const [query, setQuery] = React.useState('');
  // ...typing in the search box no longer triggers a re-parse of filters
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

This is a common perf trap: state initializers that look "run once" at a glance are actually eager function calls unless wrapped in the `() => ...` lazy form.
