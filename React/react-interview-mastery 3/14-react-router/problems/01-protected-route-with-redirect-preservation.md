# Problem: Implement a `<ProtectedRoute>` Wrapper With Post-Login Redirect

**Requirements:**
- Redirect unauthenticated users to `/login`.
- Preserve the location the user was trying to reach so `/login` can send them back after a successful login.
- Don't pollute browser history with the redirect itself.

## Solution

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // stash the attempted location; replace so the redirect itself
    // doesn't become a back-button stop
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // support both `<ProtectedRoute><Page /></ProtectedRoute>` and
  // `<Route element={<ProtectedRoute />}>` (nested-route guard) usages
  return children ?? <Outlet />;
}

export default ProtectedRoute;
```

```jsx
// route setup
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  />
</Routes>
```

```jsx
// LoginPage.jsx — reads back the stashed location and redirects there post-login
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/dashboard';

  async function handleLogin(credentials) {
    await login(credentials);
    navigate(from, { replace: true });
  }

  return <LoginForm onSubmit={handleLogin} />;
}
```

**Notes:**
- `replace` on the redirect to `/login` prevents the back button from looping between `/login` and the protected page.
- `state={{ from: location }}` is the mechanism that lets `/login` know where to send the user afterward — without it you'd have to hardcode a single fallback destination.
- For multiple protected routes, prefer the `<Outlet />`-based nested-route form (`<Route element={<ProtectedRoute />}>...</Route>`) over wrapping every leaf route individually — see the runnable version in `../projects/protected-routes-demo/`.
