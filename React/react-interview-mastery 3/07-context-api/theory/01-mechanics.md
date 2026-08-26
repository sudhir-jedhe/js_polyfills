*** copy 01-mechanics.md ***

# The mechanics

Context has three parts: create it, provide a value somewhere in the tree, and consume it anywhere below.

```jsx
const ThemeContext = createContext('light'); // default value, used if no Provider is above

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <Button />; // doesn't need to know about theme at all
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

`Toolbar` never touches `theme` — that's the point. Without Context, `theme` would have to be passed as a prop through every intermediate component (`Toolbar`) even though only `Button` cares about it. That's prop drilling, and it gets unwieldy fast in deep trees or when many unrelated components need the same piece of data (current user, theme, locale, feature flags).

The default value passed to `createContext(defaultValue)` is only used when a component calls `useContext` and there is no matching `Provider` above it in the tree — useful for testing components in isolation, or as a sane fallback.

## Multiple providers, nearest wins

A consumer reads from the *nearest* Provider above it in the tree. You can nest Providers of the same context to override its value for a specific subtree (e.g. a "preview mode" section using a different theme than the rest of the app) without affecting siblings outside that subtree.
