# A Pricing Page Needs URL-Driven Tabs Instead of Local Tab State

A marketing team wants `/pricing` to support both `/pricing` and `/pricing/enterprise`, `/pricing/startup` as sub-pages sharing the same header/tabs UI, and they want the URL to be the source of truth for which tab is active (not local component state). How do you build this?

**Approach:** Use a layout route with an `Outlet` for the shared tab UI, and derive the active tab from the current path via `useLocation` (or `NavLink`'s built-in active styling) rather than local state.

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
        <NavLink to="/pricing/enterprise" className={({ isActive }) => isActive ? 'active' : ''}>
          Enterprise
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

<Route path="/pricing" element={<PricingLayout />}>
  <Route index element={<GeneralPricing />} />
  <Route path="startup" element={<StartupPricing />} />
  <Route path="enterprise" element={<EnterprisePricing />} />
</Route>
```

`NavLink`'s `isActive` (URL-derived) replaces any local "which tab is selected" state entirely — the URL is the single source of truth, so refreshing, sharing a link, or using back/forward all work correctly without extra synchronization code.
