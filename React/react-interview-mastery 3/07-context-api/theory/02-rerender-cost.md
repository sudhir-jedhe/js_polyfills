*** copy 02-rerender-cost.md ***

# The re-render cost

This is the detail interviewers probe hardest. **Every component that calls `useContext(SomeContext)` re-renders whenever the `value` prop passed to `SomeContext.Provider` changes** — React compares the new value to the old one with `Object.is`, and if they differ, all consumers re-render, full stop. It does not matter if the consumer only destructures one field out of a larger object.

```jsx
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // New object every render — even if only `notifications` changed,
  // every consumer that reads `user` also re-renders.
  const value = { user, setUser, notifications, setNotifications };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

Two compounding problems here: first, `value` is a brand-new object literal on every render of `AppProvider`, so it fails the `Object.is` check even when nothing meaningful changed (fix with `useMemo`). Second, even with memoization, if `notifications` updates, every consumer re-renders — including ones that only care about `user` — because Context doesn't do selective/fine-grained subscriptions like some external libraries do.

```jsx
const value = useMemo(
  () => ({ user, setUser, notifications, setNotifications }),
  [user, notifications]
);
```

That fixes the "new object every render" problem, but not the "unrelated consumers re-render" problem — for that, split contexts.

## `React.memo` does not help here

Wrapping a component in `React.memo` only affects re-renders triggered by prop changes from its parent — it has no effect on re-renders triggered by a subscribed context's value changing. A memoized component that calls `useContext` still re-renders whenever that context's value reference changes, regardless of its memo status.
