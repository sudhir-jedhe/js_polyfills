*** copy 07-unmemoized-value-reruns-effect.md ***

# Output-Based: Does an unmemoized context value re-run an effect that depends on it?

```jsx
const ConfigContext = createContext();

function ConfigProvider({ children }) {
  return (
    <ConfigContext.Provider value={{ apiUrl: 'https://api.example.com' }}>
      {children}
    </ConfigContext.Provider>
  );
}

function Widget() {
  const config = useContext(ConfigContext);
  useEffect(() => {
    console.log('fetching from', config.apiUrl);
  }, [config]);
  return null;
}
```

Every time `ConfigProvider`'s parent re-renders (even though `apiUrl` never changes), does the effect in `Widget` re-run?

**Answer:** Yes, it re-runs on every re-render of `ConfigProvider`.

**Why:** The object literal `{ apiUrl: '...' }` is recreated on every render of `ConfigProvider`, giving `config` a new reference each time even though its contents never change. The `useEffect` dependency array contains `config` (the whole object), and since it's a new reference every render, the effect fires every time. Fixing this requires memoizing the context value with `useMemo(() => ({ apiUrl: '...' }), [])` or depending on `config.apiUrl` directly instead of the whole object.
