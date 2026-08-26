*** copy 04-updating-nested-object-state.md ***

# Updating a Nested Object in State Without Mutating It

```jsx
function ProfileForm() {
  const [form, setForm] = React.useState({ name: '', address: { city: '' } });
  function setCity(city) {
    setForm(prev => ({ ...prev, address: { ...prev.address, city } }));
  }
  return <input value={form.address.city} onChange={e => setCity(e.target.value)} />;
}
```
