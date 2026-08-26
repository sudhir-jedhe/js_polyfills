# Nested Routes and Layout Routes

A parent route can render a shared layout (nav bar, sidebar) with an `<Outlet />` placeholder where the matched child route renders:

```jsx
function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main><Outlet /></main> {/* child route renders here */}
    </div>
  );
}

<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />       {/* /dashboard */}
    <Route path="settings" element={<Settings />} />  {/* /dashboard/settings */}
    <Route path="billing" element={<Billing />} />     {/* /dashboard/billing */}
  </Route>
</Routes>
```

`index` marks the default child rendered at the parent's exact path. Nested paths are relative — no need to repeat `/dashboard/`.

`<Outlet />` is a placeholder rendered inside a parent route's element, marking where the matched child route's element should render. It's what makes layout routes possible — a shared header/sidebar renders once in the parent, and only the `Outlet` content changes as the user navigates between child routes.

## Deriving active UI state from the URL, not local state

When a layout has tabs/nav items reflecting the current route, prefer deriving the active state from the URL (via `NavLink`'s built-in `isActive`) rather than tracking "which tab is selected" in local component state:

```jsx
function PricingLayout() {
  return (
    <div>
      <h1>Pricing</h1>
      <nav>
        <NavLink to="/pricing" end className={({ isActive }) => isActive ? 'active' : ''}>
          General
        </NavLink>
        <NavLink to="/pricing/startup" className={({ isActive }) => isActive ? 'active' : ''}>
          Startup
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

<Route path="/pricing" element={<PricingLayout />}>
  <Route index element={<GeneralPricing />} />
  <Route path="startup" element={<StartupPricing />} />
</Route>
```

The URL becomes the single source of truth — refreshing, sharing a link, or using back/forward all work correctly without extra synchronization code between local state and the route.
