# Does This Log a Warning or Crash?

```jsx
function Widget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data").then((r) => r.json()).then(setData);
  }, []);

  return <p>{data?.value}</p>;
}

// Widget is unmounted 10ms after mount; the fetch takes 200ms.
```

**Answer:** No crash. In React 18, calling `setData` on an unmounted component is silently ignored (no dev warning like in React 16/17's "Can't perform a React state update on an unmounted component").

**Why:** React 18 removed that specific warning because it was overly aggressive and often unavoidable in this exact scenario. The update is still wasted work, though — it's a code smell worth fixing with an abort/cleanup even if it no longer warns.
