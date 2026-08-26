*** copy 04-usereducer-and-safe-consumption.md ***

# Interview Q&A: Context + useReducer & Safe Consumption

**Q: How would you combine `useReducer` and Context to build a small global state pattern?**

Create a reducer with your state transition logic, call `useReducer` inside a Provider component, and expose `state` and `dispatch` (optionally in separate contexts) via `.Provider value={...}`. Any component below can call `useContext` to read state or get `dispatch` to send actions, without prop drilling either one.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    default: return state;
  }
}

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <CountContext.Provider value={{ state, dispatch }}>{children}</CountContext.Provider>;
}
```

**Q: What's a good pattern for handling "context used outside its Provider" errors?**

Wrap `useContext` in a custom hook that throws a descriptive error if the value is the sentinel default (commonly `undefined`), instead of letting consumers silently receive `undefined` and fail later with a confusing error:

```jsx
function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

## Comparison table: Context + useState vs Context + useReducer

| Aspect | Context + `useState` | Context + `useReducer` |
|---|---|---|
| Update logic location | Scattered across whatever component calls `setX` | Centralized in one reducer function |
| Good for | Simple, independent pieces of state (a boolean, a string) | Multiple related state transitions, complex update logic |
| Dispatch stability | Each setter (`setX`) is stable across renders | `dispatch` is stable across renders, and can be split into its own context |

Use `useState` for small, single-purpose contexts. Use `useReducer` when a provider manages several interrelated pieces of state with non-trivial transition logic — it centralizes the "how state changes" logic in one place instead of spreading multiple setter calls across consumers.
