# Splitting contexts

If a provider bundles unrelated pieces of state together, split it into separate contexts so consumers only subscribe to what they actually need:

```jsx
const UserContext = createContext();
const NotificationsContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  return (
    <UserContext.Provider value={user}>
      <NotificationsContext.Provider value={notifications}>
        {children}
      </NotificationsContext.Provider>
    </UserContext.Provider>
  );
}
```

A common related pattern: split **state** from **dispatch** into two contexts when using `useReducer`, since the dispatch function is referentially stable (from `useReducer`) and rarely needs to trigger re-renders on its own — consumers that only dispatch actions (and never read state) won't re-render when state changes.
