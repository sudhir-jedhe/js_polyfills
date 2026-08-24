# Given Nested Protected Routes Using a Layout-Style Guard, What Happens to `/settings/billing` if Unauthenticated?

```jsx
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
<Routes>
  <Route element={<RequireAuth />}>
    <Route path="/settings" element={<SettingsLayout />}>
      <Route path="billing" element={<Billing />} />
    </Route>
  </Route>
  <Route path="/login" element={<Login />} />
</Routes>
```

**Answer:** The user is redirected to `/login`, and neither `SettingsLayout` nor `Billing` ever renders.

**Why:** `RequireAuth` is the parent of the entire `/settings` branch. Since it renders `<Navigate>` instead of `<Outlet />` when unauthenticated, React Router never even attempts to match/render the nested `/settings/billing` route — the guard short-circuits the whole subtree in one place, which is the point of putting auth checks at a shared ancestor rather than repeating them per leaf route.
