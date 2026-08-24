# An Event Handler Error (Will NOT Be Caught — Needs try/catch)

```jsx
function SubmitButton() {
  function handleClick() {
    try {
      riskyOperation();
    } catch (err) {
      console.error('Handled manually:', err); // boundary can't see this
    }
  }
  return <button onClick={handleClick}>Submit</button>;
}
```
