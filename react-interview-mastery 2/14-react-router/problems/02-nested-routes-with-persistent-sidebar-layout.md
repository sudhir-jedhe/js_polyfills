# Problem: Nested Routes With a Shared Sidebar Layout

**Requirements:**
- A sidebar (and any other chrome) must persist across child route changes — it shouldn't unmount/remount when navigating between child pages.
- Child pages render into a single, well-defined slot in the layout.
- The default child page renders at the parent's exact path.

## Solution

```jsx
import { Outlet, NavLink } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
            Overview
          </NavLink>
          <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            Settings
          </NavLink>
          <NavLink to="/dashboard/billing" className={({ isActive }) => isActive ? 'active' : ''}>
            Billing
          </NavLink>
        </nav>
      </aside>
      <main className="content">
        {/* only this part swaps as the child route changes —
            <aside> above never remounts */}
        <Outlet />
      </main>
    </div>
  );
}

function DashboardHome() {
  return <h1>Overview</h1>;
}

function Settings() {
  return <h1>Settings</h1>;
}

function Billing() {
  return <h1>Billing</h1>;
}
```

```jsx
// route setup
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="settings" element={<Settings />} />
    <Route path="billing" element={<Billing />} />
  </Route>
</Routes>
```

**Notes:**
- `DashboardLayout` renders once for the whole `/dashboard/*` branch; only the `<Outlet />` content changes as the user clicks between "Overview," "Settings," and "Billing" — the sidebar's own state (e.g., scroll position, a collapsed/expanded flag) survives navigation because it never unmounts.
- `index` marks `DashboardHome` as the element for the exact `/dashboard` path (no further segment).
- `NavLink`'s `isActive` derives the highlighted nav item directly from the URL, so there's no separate "which item is selected" state to keep in sync.
