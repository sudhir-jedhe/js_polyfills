import { useState, useEffect, useCallback } from 'react';

/**
 * useToggle — boolean state with a stable toggle function.
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setOff = useCallback(() => setValue(false), []);
  return [value, toggle, setOff];
}

/**
 * useLocalStorage — state persisted across page reloads via localStorage.
 * Mirrors useState's [value, setValue] shape; setValue accepts a value or
 * an updater function.
 */
export function useLocalStorage(key, initialValue) {
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
      // storage full or unavailable — fail silently
    }
  }, [key, value]);

  const setStoredValue = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  return [value, setStoredValue];
}

/**
 * useDebounce — delays reflecting a fast-changing value until it's stopped
 * changing for `delay` milliseconds.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
