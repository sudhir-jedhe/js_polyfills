# Snippet: Basic createContext + Provider + useContext

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Panel />
    </ThemeContext.Provider>
  );
}

function Panel() {
  const theme = useContext(ThemeContext);
  return <div className={`panel panel--${theme}`}>Panel content</div>;
}
```
