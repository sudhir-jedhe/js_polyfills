# Admin Dashboard Should Gate Several Pages and Return the User to Where They Started

You're building an admin dashboard with several pages (`/admin/users`, `/admin/reports`, `/admin/settings`) that should all be inaccessible to non-admin users, redirecting them to `/login` and — after they log in — sending them back to the page they originally tried to visit. How do you architect this?

**Approach:** Use a single layout-style guard wrapping all admin routes, and capture the attempted location in the redirect's `state` so the login page can send the user back afterward.

```jsx
function RequireAdmin() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user?.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/admin';

  async function handleLogin(credentials) {
    await login(credentials);
    navigate(from, { replace: true });
  }
  return <LoginForm onSubmit={handleLogin} />;
}

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<RequireAdmin />}>
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/reports" element={<AdminReports />} />
    <Route path="/admin/settings" element={<AdminSettings />} />
  </Route>
</Routes>
```

One guard covers every current and future `/admin/*` route without repeating the auth check per page, and `replace` on both redirects keeps the back button from looping through `/login`.
