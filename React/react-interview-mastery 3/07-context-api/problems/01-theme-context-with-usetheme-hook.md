***  01-theme-context-with-usetheme-hook.md ***

# Problem: `ThemeContext` with a `useTheme()` custom hook, throwing outside its Provider

## Task

Build a `ThemeContext` that exposes `theme` and a `toggleTheme` function, wrapped by a `useTheme()` custom hook. Calling `useTheme()` outside a `ThemeProvider` should throw a clear runtime error instead of silently returning `undefined`.

## Solution

```jsx
import { createContext, useContext, useState, useMemo } from 'react';

// Sentinel default of `undefined` lets useTheme() detect "no Provider above".
const ThemeContext = createContext(undefined);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  // Memoize so ThemeProvider re-rendering for unrelated reasons doesn't
  // force every consumer to re-render with a "new" but equivalent value.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}

function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#fff' : '#222',
        color: theme === 'light' ? '#222' : '#fff',
        border: '1px solid #888',
        padding: '8px 16px',
      }}
    >
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}

export default App;

// Demonstrating the error: rendering <ThemedButton /> without <ThemeProvider>
// above it throws "useTheme must be used within a <ThemeProvider>" the moment
// useTheme() runs, instead of crashing later with a confusing
// "Cannot read properties of undefined (reading 'theme')".
```

## Why this works

- `createContext(undefined)` combined with a strict `=== undefined` check in `useTheme` distinguishes "no Provider was found" from "the Provider legitimately provided a falsy value" — important because `theme` itself could theoretically be an empty string or other falsy value in a more complex version of this context.
- `useTheme` is the *only* sanctioned way components access theme — nobody calls `useContext(ThemeContext)` directly, so the guard can't accidentally be bypassed.
- `useMemo` on the provider's `value` keeps `{ theme, toggleTheme }` referentially stable across renders where `theme` hasn't changed, avoiding the classic "new object every render forces every consumer to re-render" context pitfall.
- The error is thrown synchronously during render, at the exact call site of `useTheme()`, which gives a much clearer stack trace than letting `theme` be `undefined` and crashing later inside JSX.
