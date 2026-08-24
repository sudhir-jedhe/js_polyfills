# Scenario: A theme toggle button re-renders the entire page tree

You're building a theme toggle in the header. Clicking it flips `ThemeContext`'s value between `light` and `dark`, but you notice (via React DevTools profiler) that a large, unrelated data table below re-renders every time, even though it doesn't read `ThemeContext` at all.

**Approach:** First verify the data table genuinely doesn't call `useContext(ThemeContext)` anywhere in its subtree — if it truly doesn't, the re-render isn't caused by context at all, it's caused by the table being a child of a component that re-renders for other reasons (e.g., the header and table share a common non-memoized parent that re-renders on state change, cascading to all children by default).

```jsx
function Page() {
  const [theme, setTheme] = useState('light'); // lives in Page, so Page re-renders on toggle
  return (
    <>
      <Header theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
      <DataTable /> {/* re-renders too, just because Page re-rendered */}
    </>
  );
}
```

Fix by moving the theme state (and its Provider) into a component that only wraps what actually needs it, or by wrapping `DataTable` in `React.memo` so it skips re-rendering when its own props haven't changed:

```jsx
const DataTable = React.memo(function DataTable() { /* ... */ });
```

If the app does use `ThemeContext` and `DataTable` legitimately doesn't consume it, `React.memo` alone won't help if `DataTable` is inside the `ThemeProvider`'s children and something else about the parent re-renders — the fix there is ensuring `ThemeProvider`'s `value` is memoized so its own re-renders (for unrelated reasons) don't create a new context value.
