*** copy 01-bundled-context-laggy-search.md ***

# Scenario: A single "app state" context is causing the whole app to lag on every keystroke

You're building a dashboard with a single `AppContext` holding `{ user, theme, searchQuery, notifications }`, updated from various places, including a search box that updates `searchQuery` on every keystroke. Users on lower-end devices report the whole app feels laggy while typing in search.

**Approach:** Every keystroke updates `searchQuery`, which changes the single bundled context object, which re-renders *every* consumer of `AppContext` — including components that only care about `user` or `theme` and have nothing to do with search. Split the context by concern so unrelated consumers stop re-rendering:

```jsx
const UserContext = createContext();
const ThemeContext = createContext();
const SearchContext = createContext();
const NotificationsContext = createContext();

function AppProviders({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  return (
    <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
      <ThemeContext.Provider value={useMemo(() => ({ theme, setTheme }), [theme])}>
        <SearchContext.Provider value={useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery])}>
          <NotificationsContext.Provider value={useMemo(() => ({ notifications, setNotifications }), [notifications])}>
            {children}
          </NotificationsContext.Provider>
        </SearchContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

Now typing in search only re-renders components subscribed to `SearchContext`. If search results themselves are rendered from a large list, additionally debounce the query before it hits state, and consider `React.memo` on list rows.
