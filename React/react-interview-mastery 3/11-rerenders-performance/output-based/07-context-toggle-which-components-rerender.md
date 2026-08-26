# Output-Based: Given a Context Provider Wrapping the App, Which Components Re-Render When It Toggles?

```jsx
const ThemeContext = createContext();
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar onToggle={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} />
      <Sidebar />
    </ThemeContext.Provider>
  );
}
function Toolbar({ onToggle }) {
  return <button onClick={onToggle}>Toggle</button>;
}
function Sidebar() {
  return <SidebarLink />;
}
function SidebarLink() {
  const theme = useContext(ThemeContext);
  return <a className={theme}>Link</a>;
}
```
**Answer:** `App` re-renders (state owner), `Toolbar` and `Sidebar` re-render too (they're children of `App`, not memoized), and `SidebarLink` re-renders because it consumes the changed context value.

**Why:** Nothing here is memoized, so the parent re-render alone would cascade through `Toolbar`/`Sidebar`/`SidebarLink` regardless of context. The context change is actually redundant with the parent-cascade in this particular example — it would only matter independently if `Sidebar`/`SidebarLink` were wrapped in `memo`, in which case the context change would still force `SidebarLink` (but not necessarily `Sidebar`) to re-render.
