# Data Routers and Loader Functions

Modern React Router (v6.4+ "data routers", created with `createBrowserRouter`) supports a `loader` function per route that fetches data *before* the route renders, decoupling data fetching from component mount and enabling render-as-you-fetch instead of fetch-on-mount waterfalls:

```jsx
const router = createBrowserRouter([
  {
    path: '/users/:userId',
    element: <UserProfile />,
    loader: async ({ params }) => {
      const res = await fetch(`/api/users/${params.userId}`);
      if (!res.ok) throw new Response('Not Found', { status: 404 });
      return res.json();
    },
  },
]);

function UserProfile() {
  const user = useLoaderData(); // data resolved by the loader above
  return <h1>{user.name}</h1>;
}
```

This is a meaningful shift from the older pattern of fetching inside `useEffect` after mount — loaders run in parallel with route transition (and any code-splitting for the route), and errors thrown in a loader are caught by that route's `errorElement`, so the data is often already resolved by the time the component renders, eliminating the extra spinner-then-content flash a `useEffect`-based fetch produces on every navigation.

## `BrowserRouter` vs `createBrowserRouter` (data routers)

| Aspect | `BrowserRouter` + `Routes`/`Route` | `createBrowserRouter` (data router API, v6.4+) |
|---|---|---|
| Data loading | Manual — typically `useEffect` + fetch inside each route's component | Built-in `loader`/`action` functions per route, resolved before/alongside rendering via `useLoaderData` |
| Error handling | Manual, usually via error boundaries you add yourself | Built-in `errorElement` per route, automatically shown when a `loader`/`action`/render throws |
| Common mistake | Fetching data only after mount, causing request waterfalls (route renders, then effect fires, then data arrives) | Assuming you must migrate the whole app at once — data routers can be adopted incrementally, route by route |

Use the classic `Routes`/`Route` API for simple apps or when data fetching is already centralized (e.g., via a data-fetching library like React Query). Use data routers when you want route-level data loading/error handling built into the routing layer itself.

## 404s vs valid-route-with-missing-data

For an unmatched URL, add a catch-all route `<Route path="*" element={<NotFound />} />` at the end of your route tree. For a valid route whose specific resource doesn't exist (e.g., `/products/999` where 999 was deleted), handle it inside the component/loader — either render a "not found" state directly, redirect to a dedicated not-found page, or (with a data router) throw a `Response('Not Found', { status: 404 })` from the loader and let a route's `errorElement` handle it automatically.
