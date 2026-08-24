# Handling multiple fields with one handler

A common pattern: give every input a `name` matching a key in a single state object, and use one generic `onChange`:

```jsx
function SignupForm() {
  const [form, setForm] = React.useState({ email: '', password: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" value={form.password} onChange={handleChange} />
    </>
  );
}
```

This scales to any number of fields without writing a new handler per input, as long as `name` matches the state key.
