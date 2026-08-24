# Snippet: Uncontrolled input read via ref on submit

```jsx
function UncontrolledForm() {
  const nameRef = React.useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    alert(`Hello, ${nameRef.current.value}`);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```
