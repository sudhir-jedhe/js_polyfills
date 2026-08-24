# What Happens After `navigate('/login')`, Then Login, Then Pressing Back?

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // no `replace`
  }
  return children;
}
```

**Answer:** After logging in and clicking "back," the user lands back on `/login` (not the originally protected page), because the redirect pushed a new history entry rather than replacing the current one.

**Why:** Without `replace`, `<Navigate to="/login" />` adds `/login` as a *new* entry on top of the protected route's entry in the history stack (`[..., /dashboard, /login]`). Going back pops off `/login`'s own push, landing the user at `/dashboard` again momentarily, then since they're now authenticated it renders fine — but if they'd been redirected to `/login` multiple times without `replace`, the back button becomes a confusing loop through several stacked `/login` entries. Using `<Navigate to="/login" replace />` avoids polluting history with the redirect itself.
