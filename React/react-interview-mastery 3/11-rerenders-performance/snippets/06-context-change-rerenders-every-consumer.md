# Snippet: Context Change Re-Renders Every Consumer, Even Unrelated Ones

```jsx
const ThemeContext = createContext({ theme: 'light', user: 'anon' });
function App() {
  const [theme, setTheme] = useState('light');
  const value = { theme, user: 'anon' }; // new object every render too!
  return (
    <ThemeContext.Provider value={value}>
      <ThemeToggleButton onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} />
      <UserBadge /> {/* re-renders on every theme toggle, doesn't even read theme */}
    </ThemeContext.Provider>
  );
}
function UserBadge() {
  const { user } = useContext(ThemeContext);
  console.log('UserBadge rendered');
  return <span>{user}</span>;
}
```
