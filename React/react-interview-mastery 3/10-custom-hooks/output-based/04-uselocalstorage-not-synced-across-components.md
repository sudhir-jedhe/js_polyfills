***  04-uselocalstorage-not-synced-across-components.md ***

# Output-Based: useLocalStorage Instances Are Not Synced Across Components

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function ComponentA() {
  const [theme] = useLocalStorage('theme', 'light');
  return <p>A sees: {theme}</p>;
}

function ComponentB() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <button onClick={() => setTheme('dark')}>B: {theme}</button>;
}
```

Both are rendered as siblings. The user clicks the button in `ComponentB`. Does `ComponentA`'s displayed text update to "A sees: dark" immediately?

**Answer:** No — `ComponentA` still shows "A sees: light" until it happens to re-render for some other reason (e.g., a remount or a manual refresh); it does not automatically pick up B's change.

**Why:** Each call to `useLocalStorage` creates its own independent `useState`, so `ComponentA`'s in-memory `value` isn't linked to `ComponentB`'s. Clicking B's button updates B's own state (which then also writes to `localStorage`) — but A has no mechanism to know that write happened, since it only read `localStorage` once, on its own initial mount. To truly sync across components you'd need to also listen for the `storage` event (which only fires in *other* tabs/windows, not the same one) or use Context/a shared store instead.
