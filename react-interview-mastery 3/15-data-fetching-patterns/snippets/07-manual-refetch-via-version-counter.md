# Manual Refetch/Retry via a Version Counter

```jsx
function RetryableData({ url }) {
  const [version, setVersion] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then((r) => r.json()).then(setData);
  }, [url, version]);

  return (
    <div>
      <pre>{JSON.stringify(data)}</pre>
      <button onClick={() => setVersion((v) => v + 1)}>Retry</button>
    </div>
  );
}
```
