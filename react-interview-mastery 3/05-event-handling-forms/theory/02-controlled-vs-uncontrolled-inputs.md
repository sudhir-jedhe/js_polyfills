# Controlled vs. uncontrolled inputs

A **controlled** input's value is driven entirely by React state — the DOM element's `value` always mirrors state, and every keystroke goes through `onChange` to update that state:

```jsx
function ControlledInput() {
  const [value, setValue] = React.useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

An **uncontrolled** input manages its own value internally in the DOM; React only reads it on demand, typically via a `ref`:

```jsx
function UncontrolledInput() {
  const inputRef = React.useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Controlled is the default recommendation for most forms — it makes validation, conditional disabling, and derived UI trivial since state is always the single source of truth. Uncontrolled is useful for simple/one-off forms, integrating non-React widgets, or file inputs (`<input type="file">` can't be controlled by React — its value is read-only from JS for security reasons).
