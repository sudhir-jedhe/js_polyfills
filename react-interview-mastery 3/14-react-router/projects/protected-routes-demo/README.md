# Protected Routes Demo

A small, runnable React Router v6+ app demonstrating the protected-route redirect pattern end to end: an `AuthContext` for logged-in state, a `<ProtectedRoute>` guard, a public `Login` page, and an auth-gated `Dashboard` page.

## Structure

```
src/
  main.jsx                     entry point, wraps the app in BrowserRouter + AuthProvider
  App.jsx                      route table
  context/AuthContext.jsx      fake auth state (isAuthenticated, user, login, logout)
  components/ProtectedRoute.jsx  layout-style auth guard (Navigate vs Outlet)
  components/NavBar.jsx        top nav, shows login/logout depending on auth state
  pages/HomePage.jsx           public page
  pages/LoginPage.jsx          reads location.state.from and redirects back after login
  pages/DashboardPage.jsx      protected page
```

## How to run

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## How to test the protected-route redirect

1. Load the app while logged out (the default state). Click **Dashboard** in the nav, or navigate directly to `/dashboard`.
2. You should be redirected to `/login`, and the login page shows: `You were trying to reach: /dashboard`.
3. Enter any email and submit. The fake `login()` resolves after a short simulated delay.
4. You should land back on `/dashboard` automatically (not some hardcoded default page) — this proves `location.state.from` round-tripped through the redirect.
5. Click **Log out** in the nav, then try `/dashboard` again to confirm the guard re-engages.
6. Optional: after logging in, use the browser's back button. Because both redirects use `{ replace: true }`, you should not get stuck bouncing between `/login` and `/dashboard`.

## Key implementation detail

`ProtectedRoute` is a layout-style guard (`<Route element={<ProtectedRoute />}>` wrapping nested `<Route>`s with `<Outlet />`), not a per-page wrapper — this is what lets you add more protected pages under the same guard without repeating the auth check on each one. See `src/components/ProtectedRoute.jsx` and `src/App.jsx`.
