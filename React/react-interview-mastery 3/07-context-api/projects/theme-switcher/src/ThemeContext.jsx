import { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Sentinel default of `undefined` lets useTheme() detect "no ThemeProvider
// above this component" and throw a clear error instead of silently
// returning undefined and crashing later somewhere unrelated.
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children, defaultTheme = 'light' }) {
  const [theme, setTheme] = useState(defaultTheme);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  function setThemeExplicit(next) {
    if (next !== 'light' && next !== 'dark') {
      throw new Error(`Invalid theme "${next}" — expected "light" or "dark"`);
    }
    setTheme(next);
  }

  // Reflect the theme on <html data-theme="..."> so plain CSS (see
  // styles.css) can style the whole page, not just React-rendered nodes.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Memoize so ThemeProvider re-rendering for unrelated reasons doesn't
  // force every consumer to re-render with a "new" but equivalent value —
  // this is the fix from ../../theory/02-rerender-cost.md applied for real.
  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme: setThemeExplicit }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a <ThemeProvider>. Did you forget to wrap your app?');
  }
  return ctx;
}
