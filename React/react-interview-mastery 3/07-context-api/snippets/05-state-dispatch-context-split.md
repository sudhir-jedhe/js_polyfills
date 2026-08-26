*** copy 05-state-dispatch-context-split.md ***

# Snippet: Splitting state and dispatch contexts

```jsx
// Dispatch is stable, so splitting it out avoids extra re-renders for
// components that only need to dispatch and never read state.
const CountStateContext = createContext();
const CountDispatchContext = createContext();

function countReducer(state, action) {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    default: return state;
  }
}

function CountProvider({ children }) {
  const [count, dispatch] = useReducer(countReducer, 0);
  return (
    <CountStateContext.Provider value={count}>
      <CountDispatchContext.Provider value={dispatch}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}

function CountDisplay() {
  const count = useContext(CountStateContext);
  return <p>{count}</p>;
}

function CountButtons() {
  const dispatch = useContext(CountDispatchContext); // never causes CountDisplay to re-render
  return (
    <>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```
