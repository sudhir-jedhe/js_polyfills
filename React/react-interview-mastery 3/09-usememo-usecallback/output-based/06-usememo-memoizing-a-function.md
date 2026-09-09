***  06-usememo-memoizing-a-function.md ***

# Output-Based: useMemo Memoizing a Function

```jsx
function Form() {
  const [name, setName] = useState('');
  const validate = useMemo(() => (value) => value.trim().length > 0, []);

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

What is `validate` here — is this a reasonable use of `useMemo`?

**Answer:** `validate` is a memoized function reference (`useMemo` returning a function, rather than a computed value), functionally identical to `useCallback((value) => value.trim().length > 0, [])`. It works correctly, but it's non-idiomatic — using `useMemo` to memoize a function is unusual and less clear than just using `useCallback` for that purpose.

**Why:** `useMemo(() => fn, deps)` and `useCallback(fn, deps)` produce the same result — `useCallback` is literally implemented as a thin wrapper over this exact pattern. Since the intent here ("memoize this function") maps directly onto `useCallback`'s purpose, most style guides and linters would flag this as better written as `useCallback((value) => value.trim().length > 0, [])`.
