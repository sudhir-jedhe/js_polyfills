# A Tiny Reusable useFetch Hook

```jsx
function useFetch(url) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, data: null, error: null });
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ loading: false, data: null, error });
        }
      });
    return () => controller.abort();
  }, [url]);

  return state;
}
```
