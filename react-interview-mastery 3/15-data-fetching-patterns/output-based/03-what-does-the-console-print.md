# What Does the Console Print?

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch("/api/slow", { signal: controller.signal })
    .catch((e) => console.log(e.name));
  controller.abort();
}, []);
```

**Answer:** `"AbortError"`

**Why:** Calling `controller.abort()` synchronously right after starting the fetch still cancels it — the abort signal is checked asynchronously by the fetch implementation. The fetch promise rejects with a `DOMException` whose `name` is `"AbortError"`.
