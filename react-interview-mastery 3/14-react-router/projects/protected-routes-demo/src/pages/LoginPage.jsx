import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // where the user was headed before being redirected here, if anywhere
  const from = location.state?.from?.pathname ?? '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await login({ email });
    // send the user back to their originally intended destination,
    // replacing this /login entry so back doesn't return here
    navigate(from, { replace: true });
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Log in</h1>
      <p>You were trying to reach: <code>{from}</code></p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
