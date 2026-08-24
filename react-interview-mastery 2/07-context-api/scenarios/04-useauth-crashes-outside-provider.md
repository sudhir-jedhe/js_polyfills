# Scenario: A `useAuth()` hook returns `undefined` and crashes a component in production, but not in tests

Your app crashes with "Cannot read properties of undefined" when calling `user.name` inside a component using `useContext(AuthContext)`. It works fine in tests because tests always wrap the component in `<AuthProvider>`, but in production a newly added route was rendered outside the provider tree by mistake.

**Approach:** Guard the context consumption with a custom hook that throws a clear, early error rather than letting `undefined` silently propagate into a cryptic runtime error deep in the render:

```jsx
const AuthContext = createContext(undefined);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>. Did you forget to wrap this route?');
  }
  return ctx;
}
```

This turns a confusing "cannot read property of undefined" (pointing at the wrong line) into an immediate, actionable error at the exact point of misuse. Then fix the actual routing bug — likely the new route was added as a sibling of `<AuthProvider>` in the router config instead of a child. This pattern (default value `undefined` + throwing wrapper hook) is worth using for every context that's genuinely required, not optional.
