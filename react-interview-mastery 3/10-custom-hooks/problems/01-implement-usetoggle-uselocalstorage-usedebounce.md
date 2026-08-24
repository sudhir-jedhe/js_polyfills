# Problem 1: Implement `useToggle`, `useLocalStorage`, and `useDebounce`

All three, fully working, with realistic usage examples.

## `useToggle`

```jsx
import { useState, useCallback } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setOn = useCallback(() => setValue(true), []);
  const setOff = useCallback(() => setValue(false), []);

  return [value, toggle, { setOn, setOff }];
}

// usage
function Modal() {
  const [isOpen, toggleOpen, { setOff }] = useToggle(false);
  return (
    <>
      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'} modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={setOff}>Dismiss</button>
        </div>
      )}
    </>
  );
}
```

## `useLocalStorage`

```jsx
import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue; // SSR safety
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue; // corrupt JSON or storage unavailable — fall back
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable (e.g. private browsing) — fail silently
    }
  }, [key, value]);

  // Accepts either a value or an updater function, mirroring useState's API
  const setStoredValue = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next));
  }, []);

  return [value, setStoredValue];
}

// usage
function PersistedCounter() {
  const [count, setCount] = useLocalStorage('counter', 0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

## `useDebounce`

```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancel pending update if value changes again first
  }, [value, delay]);

  return debounced;
}

// usage
function SearchBox() {
  const [text, setText] = useState('');
  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    if (debouncedText) console.log('searching for:', debouncedText);
  }, [debouncedText]);

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search…"
    />
  );
}
```

All three hooks follow the Rules of Hooks (unconditional top-level calls), return values in the conventional `[value, setter, ...extras]` shape that mirrors `useState`, and are independently reusable across any number of components — see `problems/03-prove-independent-hook-instances.md` for a demonstration that each call site gets its own state.
