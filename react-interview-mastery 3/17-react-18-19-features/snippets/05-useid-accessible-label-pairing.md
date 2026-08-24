# useId for Accessible Label/Input Pairing

```jsx
function EmailField({ error }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input id={id} aria-describedby={error ? errorId : undefined} />
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
```
