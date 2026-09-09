***  05-composing-usedebouncedfetch.md ***

# Snippet: Composing Custom Hooks — useDebouncedFetch Built From useDebounce + useFetch

```jsx
function useDebouncedFetch(url, delay = 300) {
  const debouncedUrl = useDebounce(url, delay);
  return useFetch(debouncedUrl);
}
```
