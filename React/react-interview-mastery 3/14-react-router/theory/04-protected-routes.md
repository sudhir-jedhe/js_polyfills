# Protected / Private Routes

Auth-gated routes are typically implemented as a wrapper component that checks auth state and either renders children/`<Outlet/>` or redirects:

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // preserve where the user was headed so we can send them back post-login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
/>
```

For multiple protected routes, wrap them under a single layout-style guard using nested routes and `<Outlet />` instead of repeating `<ProtectedRoute>` everywhere:

```jsx
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

<Route element={<RequireAuth />}>
  <Route path="/dashboard" element={<DashboardLayout />} />
  <Route path="/settings" element={<Settings />} />
</Route>
```

One guard covers every current and future route nested beneath it without repeating the auth check per page. Since `RequireAuth` is the parent of the whole branch, React Router never even attempts to match/render a deeply nested child route (e.g. `/settings/billing`) when it renders `<Navigate>` instead of `<Outlet />` — the guard short-circuits the whole subtree in one place.

## Preserving intent with `replace` and `state`

`<Navigate to="/login" state={{ from: location }} replace />` does two things:

- `state={{ from: location }}` stashes the originally requested location so the login page can read `location.state?.from` after a successful login and send the user back there.
- `replace` swaps the current history entry instead of pushing a new one. Without it, `[..., /dashboard, /login]` both sit on the stack — pressing back after logging in lands the user back on `/login` rather than where they meant to go, and repeated redirects can turn the back button into a confusing loop through several stacked `/login` entries.

```jsx
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
