# Immutable State Update for a Nested Object

```jsx
function updateAddress(setUser, city) {
  setUser((prev) => ({
    ...prev,
    address: { ...prev.address, city },
  }));
}
```
