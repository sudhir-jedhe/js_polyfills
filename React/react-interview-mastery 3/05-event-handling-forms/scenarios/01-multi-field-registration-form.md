***  01-multi-field-registration-form.md ***

# Scenario: Multi-field registration form is becoming an unmanageable pile of `useState` calls and handlers

You're building a registration form with eight fields (name, email, password, confirm password, phone, address, city, zip), and the current implementation has eight separate `useState` calls and eight nearly-identical `onChange` handlers, making the file hard to maintain.

**Approach:** Consolidate into a single state object keyed by field name, and use one generic change handler driven by each input's `name` attribute:

```jsx
function RegistrationForm() {
  const [form, setForm] = React.useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', city: '', zip: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    submitRegistration(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(form).map(field => (
        <input
          key={field}
          name={field}
          type={field.toLowerCase().includes('password') ? 'password' : 'text'}
          value={form[field]}
          onChange={handleChange}
          placeholder={field}
        />
      ))}
      <button type="submit">Register</button>
    </form>
  );
}
```

This scales to any number of text-like fields without adding new state variables or handlers — adding a field is just adding a key to the initial state object and an `<input name="...">`.
