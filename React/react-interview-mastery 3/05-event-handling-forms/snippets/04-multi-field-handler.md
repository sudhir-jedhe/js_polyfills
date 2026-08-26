*** copy 04-multi-field-handler.md ***

# Snippet: One handler for multiple named fields via the `name` attribute

```jsx
function AddressForm() {
  const [form, setForm] = React.useState({ street: '', city: '', zip: '' });
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }
  return (
    <>
      <input name="street" value={form.street} onChange={handleChange} />
      <input name="city" value={form.city} onChange={handleChange} />
      <input name="zip" value={form.zip} onChange={handleChange} />
    </>
  );
}
```
