# Basic Fetch-on-Mount With Loading/Error/Data State

```jsx
function Todo({ id }) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    fetch(`/api/todos/${id}`)
      .then((r) => r.json())
      .then((data) => setState({ status: "success", data, error: null }))
      .catch((error) => setState({ status: "error", data: null, error }));
  }, [id]);

  if (state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error") return <p>Failed: {state.error.message}</p>;
  return <p>{state.data.title}</p>;
}
```
