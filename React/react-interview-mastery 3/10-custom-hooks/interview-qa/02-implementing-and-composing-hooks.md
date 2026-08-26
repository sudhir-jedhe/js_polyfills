*** copy 02-implementing-and-composing-hooks.md ***

# Interview Q&A: Implementing and Composing Hooks

**Q: Write a `useToggle` hook and explain each part.**

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}
```

`useState` holds the boolean. `toggle` is wrapped in `useCallback` with an empty dependency array so it's referentially stable across renders — useful if it's passed to a `React.memo`-wrapped child or used as an effect dependency elsewhere. It uses the functional updater form (`v => !v`) rather than closing over `value` directly, so `toggle` never needs `value` in its own dependency array and stays correct even without recreation.

---

**Q: How would you implement a `useDebounce` hook, and what's the key mechanism that makes it work?**

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

The key mechanism is the cleanup function: every time `value` changes, the effect reruns, and before it does, React calls the *previous* effect's cleanup — clearing the previously scheduled timeout. So if `value` changes again before the delay elapses, the stale, pending update is cancelled, and only a value that's remained stable for the full `delay` ever actually gets set.

---

**Q: What's the purpose of `AbortController` in a `useFetch` custom hook, and what happens without it?**

It lets you cancel an in-flight `fetch` request when it's no longer needed — typically when the component unmounts or the URL/query changes before the previous request resolves. Without cancellation, a slower, earlier request can resolve *after* a later one and overwrite fresher data with stale data (a race condition), or attempt to call `setState` on an unmounted component, which is at best wasted work and at worst a symptom of a memory-management bug.

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(/* ... */);
  return () => controller.abort();
}, [url]);
```

---

**Q: Can a custom hook call another custom hook? Give an example.**

Yes — composing custom hooks is a normal and encouraged pattern. For example, a `useDebouncedFetch` hook can be built by combining `useDebounce` and `useFetch`:

```jsx
function useDebouncedFetch(url, delay = 300) {
  const debouncedUrl = useDebounce(url, delay);
  return useFetch(debouncedUrl);
}
```

As long as every hook involved still follows the Rules of Hooks (called unconditionally, at the top level), nesting custom hooks inside other custom hooks is exactly how complex reusable logic is typically built up from simpler pieces.
