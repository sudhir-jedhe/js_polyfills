*** copy What are the best patterns to prevent unnecessary re-renders when using React Context API?.md ***

When a React Context value updates, **every component that calls `useContext(MyContext)` re-renders unconditionally**, bypassing any `React.memo` wrappers on the consumer. To eliminate unnecessary re-renders, use the following production-tested architectural patterns.

---

**1. Split Contexts by Update Frequency (State vs. Dispatch)**

The most effective pattern is separating frequently changing values (data/state) from completely static values (updater functions or `dispatch`).

```jsx
const UserStateContext = createContext(null);
const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

// Components that only trigger actions never re-render when state changes
export function ActionButton() {
  const dispatch = useContext(UserDispatchContext);
  return <button onClick={() => dispatch({ type: 'LOGOUT' })}>Log Out</button>;
}

```

* **Why it works:** `dispatch` from `useReducer` has a guaranteed stable identity across the lifetime of the application. Components consuming only `UserDispatchContext` will never re-render when `state` updates.

---

**2. Memoize the Provider Value**

If your context value is an object or array created inline inside the Provider component, it receives a brand-new reference on every Provider render, forcing all consumers to re-render even if the actual data hasn't changed.

```jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  // ❌ Anti-pattern: value={{ theme, setTheme }} creates a new object every render

  // ✅ Solution: Memoize the object reference
  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

```

---

**3. Split Independent Data into Granular Contexts**

Avoid grouping multiple unrelated application concerns into a single "God Context" (e.g., combining `user`, `cart`, `theme`, and `notifications`).

* **Anti-Pattern:** Updating `cart` forces components that only read `theme` to re-render.
* **Pattern:** Create separate providers (`CartContext`, `ThemeContext`, `NotificationContext`). Compose them cleanly using a small wrapper component.

---

**4. The Component Colocation / Intermediate Consumer Pattern**

If a component needs only a small primitive or derived value from a large context, isolate the `useContext` call in a child or wrapper component and pass the primitive down to a `React.memo`-wrapped presenter.

```jsx
const ExpensiveChild = React.memo(function ExpensiveChild({ name }) {
  // Only re-renders if `name` actually changes
  return <h1>{name}</h1>;
});

export function ChildContainer() {
  const user = useContext(UserContext); // Re-renders whenever any user field changes
  return <ExpensiveChild name={user.name} />;
}

```

---

**5. Sub-Tree Memoization via `children` (Lifting Content Up)**

If the Provider itself manages state and re-renders frequently, ensure you pass nested UI via the `children` prop rather than rendering JSX directly inside the Provider body.

```jsx
// ✅ `children` is created in the parent scope and retains reference equality;
// React skips re-rendering `children` when CounterProvider updates its own state.
export function CounterProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <CounterContext.Provider value={count}>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {children}
    </CounterContext.Provider>
  );
}

```

---

**Summary Strategy Matrix**

| Problem                                                      | Root Cause                                               | Best Solution                                                           |
| ------------------------------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Action buttons re-rendering on data updates                  | Consumers read both state and functions from one context | **Split into State and Dispatch Contexts**                              |
| Consumers re-rendering when Provider parent renders          | Inline object creation creates new reference             | **Wrap context value in `useMemo**`                                     |
| Component reading 1 property re-renders on unrelated changes | Context contains broad, monolithic state                 | **Split into granular contexts** or **Use `React.memo` child wrappers** |
| Heavy component tree re-rendering below Provider             | Provider body re-renders sub-components                  | **Pass components via `children` prop**                                 |
