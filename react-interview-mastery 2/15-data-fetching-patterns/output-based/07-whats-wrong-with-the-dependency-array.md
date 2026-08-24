# What's Wrong With the Dependency Array?

```jsx
function Orders({ userId }) {
  const options = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetch(`/api/orders?user=${userId}`, options).then((r) => r.json()).then(setOrders);
  }, [userId, options]);

  // ...
}
```

**Answer:** The effect refetches on every render, not just when `userId` changes.

**Why:** `options` is a new object literal created on every render, so it's referentially different each time even if its contents are identical, making `[userId, options]` effectively change every render and defeating the dependency array's purpose. Fix by moving `options` inside the effect or memoizing it with `useMemo`.
