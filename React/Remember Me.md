*** copy Remember Me.md ***

A production-grade "Remember Me" login implementation in React requires distinct handling across the client and backend:

* **Client-side**: Remembers non-sensitive identifiers (like the user's email/username) using `localStorage`.
* **Security best practice**: Never store plain-text passwords in `localStorage` or `sessionStorage`. Sensitive authentication tokens should be issued by your backend as persistent `HttpOnly` refresh cookies when "Remember Me" is selected, or as temporary session cookies when unselected.

---

### Component Implementation

```tsx
import React, { useState, useEffect, FormEvent } from 'react';

const STORAGE_KEY_EMAIL = 'saved_user_email';
const STORAGE_KEY_REMEMBER = 'remember_user_preference';

export const LoginFormWithRememberMe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Populate saved email and checkbox state on mount
  useEffect(() => {
    const savedRemember = localStorage.getItem(STORAGE_KEY_REMEMBER) === 'true';
    const savedEmail = localStorage.getItem(STORAGE_KEY_EMAIL) || '';

    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Mock API call passing credentials & rememberMe flag to backend
      const response = await mockLoginApi({ email, password, rememberMe });

      if (response.success) {
        // 3. Update localStorage based on "Remember Me" toggle
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY_EMAIL, email);
          localStorage.setItem(STORAGE_KEY_REMEMBER, 'true');
        } else {
          localStorage.removeItem(STORAGE_KEY_EMAIL);
          localStorage.removeItem(STORAGE_KEY_REMEMBER);
        }

        alert('Logged in successfully!');
      }
    } catch (err) {
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        padding: '32px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ margin: '0 0 20px 0', color: '#0f172a', textAlign: 'center' }}>Sign In</h2>

      {errorMessage && (
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Remember Me Checkbox */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            Remember me
          </label>

          <a href="#forgot" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '13px' }}>
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '15px',
            cursor: isLoading ? 'wait' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

// Mock Backend API Simulation
const mockLoginApi = async (data: { email: string; password: string; rememberMe: boolean }) => {
  return new Promise<{ success: boolean }>((resolve, reject) => {
    setTimeout(() => {
      if (data.email && data.password.length >= 4) {
        resolve({ success: true });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 600);
  });
};

```

---

### Backend Token Handling for "Remember Me"

When the `rememberMe` flag is forwarded to your authentication endpoint:

| "Remember Me" State     | Token Lifecycle Strategy                                                           | Cookie Config (`Set-Cookie`)                                      |
| ----------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Checked (`true`)**    | Long-lived persistent refresh token (e.g., 30–90 days). Survives browser restarts. | `HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`              |
| **Unchecked (`false`)** | Session-only refresh token. Destroyed when the browser is closed.                  | `HttpOnly; Secure; SameSite=Strict;` *(omit `Max-Age`/`Expires`)* |
