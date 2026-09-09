***  05-context-plus-usereducer.md ***

# Context + useReducer

Pairing `useContext` with `useReducer` gives you a small, dependency-free global store: a single dispatch function, predictable state transitions, and no prop drilling.

```jsx
const CountContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <CountContext.Provider value={{ state, dispatch }}>
      {children}
    </CountContext.Provider>
  );
}
```

## Context + useState vs Context + useReducer

| Aspect | Context + `useState` | Context + `useReducer` |
|---|---|---|
| Update logic location | Scattered across whatever component calls `setX` | Centralized in one reducer function |
| Good for | Simple, independent pieces of state (a boolean, a string) | Multiple related state transitions, complex update logic |
| Dispatch stability | Each setter (`setX`) is stable across renders | `dispatch` is stable across renders, and can be split into its own context |

Use `useState` for small, single-purpose contexts (a toggle, a selected tab). Use `useReducer` when a provider manages several interrelated pieces of state with non-trivial transition logic.
