# Ignoring Out-of-Order Responses With a Cancelled Flag

```jsx
function Price({ symbol }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPrice(symbol).then((p) => {
      if (!cancelled) setPrice(p);
    });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return <span>{price ?? "..."}</span>;
}
```
