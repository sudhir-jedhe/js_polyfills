*** copy 07-checkbox-select-generic-handler.md ***

# Snippet: Checkbox and select handled through the same generic pattern

```jsx
function PreferencesForm() {
  const [prefs, setPrefs] = React.useState({ newsletter: false, plan: 'free' });
  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }
  return (
    <>
      <label>
        <input type="checkbox" name="newsletter" checked={prefs.newsletter} onChange={handleChange} />
        Subscribe to newsletter
      </label>
      <select name="plan" value={prefs.plan} onChange={handleChange}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
    </>
  );
}
```
