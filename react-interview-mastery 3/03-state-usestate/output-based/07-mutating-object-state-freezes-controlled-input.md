# What Happens on the Second Click?

```jsx
function Form() {
  const [values, setValues] = React.useState({ name: '', email: '' });
  function handleNameChange(e) {
    values.name = e.target.value; // direct mutation
    setValues(values);
  }
  return <input value={values.name} onChange={handleNameChange} />;
}
```

**Answer:** The input appears frozen — typing doesn't visibly update the field's displayed value (React may even warn about a controlled input receiving an unexpected value in some cases, or it simply never re-renders to reflect the new state).

**Why:** Same root cause as question 4: mutating `values` directly and passing the same reference back to `setValues` means React's reference-equality bailout skips the re-render. The controlled `<input value={values.name}>` therefore never sees an updated `value`, so it looks stuck even though the underlying object did technically change in memory.
