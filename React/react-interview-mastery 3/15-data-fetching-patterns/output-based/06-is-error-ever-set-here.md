# Is `error` Ever Set Here?

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch("/api/data", { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch(setError);
  return () => controller.abort();
}, [id]);
```

**Answer:** Yes — whenever the effect cleanup runs (e.g., `id` changes or unmount) before the fetch resolves, `.catch(setError)` fires with an `AbortError`, incorrectly putting the component into an error state.

**Why:** This code aborts on cleanup but doesn't distinguish `AbortError` from real failures, unlike the corrected version in the theory notes that checks `err.name !== "AbortError"`. This is a common, subtle bug: cancellation gets treated as failure.
