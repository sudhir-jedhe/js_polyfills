# Output-Based: What does typing "hi" into the input show?

```jsx
function Input() {
  const [value, setValue] = React.useState('');
  return <input value={value} />;
}
```

**Answer:** Nothing types — the input appears frozen/unresponsive, and React logs a console warning about providing a `value` prop without an `onChange` handler.

**Why:** This is a controlled input with no way to update the state backing it — `value` is fixed at `''` forever since there's no `onChange` to call `setValue`. Every keystroke the browser tries to apply gets immediately overridden back to the current React state on the next render, so the field looks unresponsive to typing.
