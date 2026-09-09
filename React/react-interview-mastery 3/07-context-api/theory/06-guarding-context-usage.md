***  06-guarding-context-usage.md ***

# Guarding against "used outside its Provider"

Wrap `useContext` in a custom hook that throws a descriptive error if the value is the sentinel default (commonly `undefined`), instead of letting consumers silently receive `undefined` and fail later with a confusing error deep in a render:

```jsx
const AuthContext = createContext(undefined);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

This pattern (default value `undefined` + a throwing wrapper hook) is worth using for every context that's genuinely required, not optional — it turns a confusing "Cannot read properties of undefined" error pointing at the wrong line into an immediate, actionable error at the exact point of misuse.
