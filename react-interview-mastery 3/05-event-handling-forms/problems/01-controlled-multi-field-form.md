# Problem: Controlled multi-field form with a single generic `handleChange`

## Task

Build a controlled signup form with fields `username`, `email`, `password`, and `role` (a `<select>`), backed by one state object and exactly one `handleChange` function keyed by each input's `name` attribute. Adding a new field should require no new handler.

## Solution

```jsx
import { useState } from 'react';

const initialForm = {
  username: '',
  email: '',
  password: '',
  role: 'member',
};

function SignupForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);

  // Single generic handler — works for <input> and <select> alike because
  // both expose `name` and `value` on e.target.
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input name="username" value={form.username} onChange={handleChange} />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
      </label>

      <label>
        Role
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <button type="submit">Create account</button>

      {submitted && (
        <pre>{JSON.stringify(submitted, null, 2)}</pre>
      )}
    </form>
  );
}

export default SignupForm;
```

## Why this works

- Every field's `name` matches a key in `form`, so `handleChange` can update the right key with a computed property name (`[name]: value`) without knowing which field triggered it.
- The `type === 'checkbox'` branch is there so the same handler also works if a checkbox field is added later (checkboxes report their state via `checked`, not `value`).
- `value={form[field]}` on every input keeps every field controlled — React state is always the single source of truth, so validation, disabling, and derived UI (like the JSON preview) all just read `form`.
- Because `handleChange` never references a specific field name in its body, adding a new field is purely additive: one new key in `initialForm` and one new `<input name="..."> `.
