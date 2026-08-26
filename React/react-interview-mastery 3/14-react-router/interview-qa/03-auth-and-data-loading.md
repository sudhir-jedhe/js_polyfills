# Interview Q&A: Auth Guards and Data Loading

**Q: How do you implement a protected/private route?**
Wrap the protected route's element in a component that checks auth state and either renders the children (or `<Outlet />` for a nested-route guard) or renders `<Navigate to="/login" replace />` to redirect. For multiple protected routes, put the check on a shared parent/layout route rather than repeating it on every leaf route.

```jsx
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
```

**Q: What is a "loader" in modern React Router, and what problem does it solve?**
A `loader` is a function attached to a route (via `createBrowserRouter`) that fetches the data that route needs, run during navigation before/alongside rendering, with the result accessible via `useLoaderData()`. It solves the "fetch-after-render waterfall" problem where a component historically had to mount first, then fire a `useEffect` fetch, causing a visible loading state on every navigation even when the fetch could have started earlier.

**Q: How would you handle a 404 for an unmatched URL, and separately, for a valid route with no matching data (e.g., a deleted resource)?**
For an unmatched URL, add a catch-all route `<Route path="*" element={<NotFound />} />` at the end of your route tree. For a valid route whose specific resource doesn't exist (e.g., `/products/999` where 999 was deleted), handle it inside the component/loader — either render a "not found" state directly, redirect to a dedicated not-found page, or (with a data router) throw a `Response('Not Found', { status: 404 })` from the loader and let a route's `errorElement` handle it.
