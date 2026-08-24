# Problem: Debounced search input, debounce implemented by hand

## Task

Build a search input that calls an (async) search function only after the user has paused typing for 300ms — without importing a debounce utility from any library.

## Solution

```jsx
import { useState, useEffect, useRef, useCallback } from 'react';

// Hand-rolled debounce: returns a debounced version of `fn` that delays
// invocation until `delay` ms have passed without another call, and cancels
// any pending call if invoked again before that.
function useDebouncedCallback(fn, delay) {
  const timeoutRef = useRef(null);
  const fnRef = useRef(fn);

  // Always call the latest `fn` without resetting the debounce timer itself.
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );

  // Cancel any pending call if the component unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debounced;
}

function DebouncedSearchInput({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isPending, setIsPending] = useState(false);

  const runSearch = useCallback(
    async (value) => {
      if (!value.trim()) {
        setIsPending(false);
        return;
      }
      const results = await onSearch(value);
      setIsPending(false);
      return results;
    },
    [onSearch]
  );

  const debouncedSearch = useDebouncedCallback(runSearch, 300);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setIsPending(true);
    debouncedSearch(value);
  }

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search…"
        aria-busy={isPending}
      />
      {isPending && <span className="search-status">searching…</span>}
    </div>
  );
}

export default DebouncedSearchInput;
```

## Why this works

- `useDebouncedCallback` is the hand-built debounce primitive: every call clears any pending `setTimeout` and schedules a new one, so only a call that goes 300ms without being followed by another call actually reaches `fn`.
- `fnRef` (a ref, updated via an effect) lets the debounced call always invoke the *latest* version of `runSearch` — even though the timer that's currently pending was scheduled by an earlier render — without that update resetting the pending timer itself, since `fnRef.current = fn` doesn't touch `timeoutRef`.
- `isPending` gives immediate UI feedback ("searching…") on every keystroke even though the actual network call is delayed, which keeps the input feeling responsive rather than dead until the debounce window elapses.
- The unmount cleanup effect clears any pending timeout, preventing a `setState` call on an unmounted component if the user navigates away mid-debounce.
- This differs from the `useEffect`-driven debounce shown in `theory/05-debouncing.md` — that pattern debounces via effect dependencies on `query`; this one is an explicit, reusable debounce function you can attach to any handler, which is the version interviewers usually want when they say "build debounce by hand."
