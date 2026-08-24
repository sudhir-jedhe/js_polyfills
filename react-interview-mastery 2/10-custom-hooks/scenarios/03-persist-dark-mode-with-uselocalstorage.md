# Scenario: A Dark Mode Preference Resets on Every Page Reload

You're building a dark mode toggle. It currently uses plain `useState(false)`, which means every page reload resets the user back to light mode, frustrating users who explicitly chose dark mode.

**Approach:** Swap the plain `useState` for a `useLocalStorage` custom hook with the same API shape, so the rest of the component's logic doesn't need to change at all:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage might be full or unavailable (e.g. private browsing) — fail silently
    }
  }, [key, value]);

  return [value, setValue];
}

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <button onClick={() => setIsDarkMode((d) => !d)}>
      {isDarkMode ? 'Switch to light' : 'Switch to dark'}
    </button>
  );
}
```

Because `useLocalStorage` mirrors `useState`'s `[value, setValue]` return shape, swapping it in was a one-line change at the call site. Worth flagging to the team: if dark mode needs to be read by multiple independent components (e.g., both a settings page and a header toggle) and stay in sync live within the same tab, `useLocalStorage` alone won't do that (each call has independent in-memory state) — that would call for lifting the state into Context instead.
