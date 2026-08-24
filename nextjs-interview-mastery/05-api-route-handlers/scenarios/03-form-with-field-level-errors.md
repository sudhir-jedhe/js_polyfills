# Scenario: Signup Form With Field-Level Validation Errors

Product wants a signup form that shows inline errors under each field (not a single generic banner) when the server rejects the submission — e.g., "email already taken" under the email field, "password too short" under the password field — without a client-side API call.

**Approach:**

This is a same-app form mutation with no external consumer, so a Server Action is the right tool, paired with `useFormState` to carry structured, field-keyed errors back to the client.

```js
// app/actions/signup.js
'use server';

export async function signup(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const errors = {};
  if (!email || !email.includes('@')) {
    errors.email = 'Enter a valid email address';
  }
  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: 'That email is already registered' } };
  }

  await db.user.create({ data: { email, password: await hash(password) } });
  return { success: true };
}
```

```jsx
// app/signup-form.jsx
'use client';
import { useFormState } from 'react-dom';
import { signup } from './actions/signup';

export default function SignupForm() {
  const [state, formAction] = useFormState(signup, { errors: {} });

  return (
    <form action={formAction}>
      <label>
        Email
        <input name="email" type="email" />
        {state.errors?.email && <span className="field-error">{state.errors.email}</span>}
      </label>
      <label>
        Password
        <input name="password" type="password" />
        {state.errors?.password && <span className="field-error">{state.errors.password}</span>}
      </label>
      <button type="submit">Create account</button>
      {state.success && <p>Account created — check your email.</p>}
    </form>
  );
}
```

Points worth raising:

1. **Structured error shape** (`{ errors: { fieldName: message } }`) is the contract between action and form — keep it consistent across every action in the app so form components can share a small error-display helper.
2. **Server-side validation is non-negotiable** even if client-side validation also exists, because the action can be reached directly (bypassing any client JS) and because "email already taken" can only be known server-side.
3. This avoids a full page navigation or client-side `fetch`/JSON dance entirely — the form posts, React reconciles the returned state, and only the error text updates.
4. If this signup also needed to be triggered from a non-browser client (e.g., a CLI onboarding tool), you'd additionally expose a thin Route Handler that calls the same underlying validation/creation logic, rather than duplicating it.
