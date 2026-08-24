# Problem: Client-side validation with per-field error messages on blur

## Task

Build a form (`email`, `password`) that only shows a field's validation error after the user has blurred that field at least once — not while they're still typing into it for the first time — and re-validates live afterward.

## Solution

```jsx
import { useState } from 'react';

const validators = {
  email: (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    return '';
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  },
};

function ValidatedForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: '', password: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Once a field has been touched, re-validate on every keystroke too,
    // so the error clears as soon as the user fixes it.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.keys(form).map((field) => [field, validators[field](form[field])])
    );
    setErrors(nextErrors);
    setTouched({ email: true, password: true });

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (!hasErrors) {
      console.log('submitting', form);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label>
        Email
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(touched.email && errors.email)}
        />
        {touched.email && errors.email && (
          <p role="alert" className="field-error">{errors.email}</p>
        )}
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(touched.password && errors.password)}
        />
        {touched.password && errors.password && (
          <p role="alert" className="field-error">{errors.password}</p>
        )}
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ValidatedForm;
```

## Why this works

- `touched` tracks, per field, whether the user has ever left it — errors only render when `touched[field]` is true, so a field's error doesn't flash while the user is still typing their very first character.
- `onBlur` is where a field first gets marked touched and validated — this is the standard UX pattern (validate on blur, not on every keystroke from the start).
- After a field is touched, `handleChange` also re-validates on every keystroke, so once an error is showing, it clears immediately as the user corrects it, instead of waiting for another blur.
- `handleSubmit` force-validates and force-touches every field, so errors for fields the user never interacted with still surface when they try to submit.
- Validators are pure functions keyed by field name (mirroring the `handleChange` pattern from the multi-field-form problem), so adding a new validated field is additive, not a rewrite.
