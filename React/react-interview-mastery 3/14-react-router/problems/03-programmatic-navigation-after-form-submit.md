# Problem: Programmatic Navigation After a Form Submission

**Requirements:**
- Submit a form (e.g., account creation), and once the async submission succeeds, navigate the user to a new route.
- Handle the failure path without navigating away.
- Avoid leaving a "resubmit-able" intermediate page in history where it doesn't make sense to go back to it.

## Solution

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSubmitting(true);
    setError(null);

    try {
      await createAccount({
        email: formData.get('email'),
        password: formData.get('password'),
      });
      // replace: true — the signup form shouldn't be reachable via back
      // button once the account has actually been created
      navigate('/welcome', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {error && <p className="error-text">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Sign up'}
      </button>
    </form>
  );
}
```

**Notes:**
- `navigate()` is called from inside the async event handler after `await createAccount()` resolves — never directly in the render body, which would be a render-phase side effect.
- `{ replace: true }` swaps the signup form out of history once the account exists, so pressing back from `/welcome` doesn't return the user to a stale, already-submitted form.
- On failure, `navigate` is never called — the component stays on the form and surfaces `error` as local state, exactly like the event-handler error-handling pattern used elsewhere (see `../../13-error-boundaries/problems/02-event-handler-errors-are-not-caught.md`).
