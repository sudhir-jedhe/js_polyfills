# Given This Route Config, What Renders at `/dashboard`?

```jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
function DashboardLayout() {
  return <div><h1>Dashboard</h1><Outlet /></div>;
}
```

**Answer:** `<h1>Dashboard</h1>` followed by whatever `DashboardHome` renders.

**Why:** `/dashboard` matches the parent route and renders `DashboardLayout`. Because there's no further path segment, the `index` child route matches and its element (`DashboardHome`) renders into the `<Outlet />`. If the URL were `/dashboard/settings` instead, `Settings` would render in the `Outlet` position instead.
