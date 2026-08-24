# A Protected Dashboard Route Shows a Spinner on Every Navigation Because of a Fetch-After-Render Waterfall

Performance testing shows the `/dashboard` route (behind a login) fetches its data only after the component mounts, causing a visible loading spinner every time, even on fast connections, because of the fetch-after-render waterfall. Your team is on React Router v6.4+. How do you improve this?

**Approach:** Move data fetching to a route `loader`, so the fetch starts as part of route matching/navigation rather than after the component has already mounted and run its first render.

```jsx
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <RequireAuth><Dashboard /></RequireAuth>,
    loader: async () => {
      const [user, stats] = await Promise.all([fetchUser(), fetchStats()]);
      return { user, stats };
    },
    errorElement: <DashboardError />,
  },
]);

function Dashboard() {
  const { user, stats } = useLoaderData();
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <StatsPanel stats={stats} />
    </div>
  );
}
```

Because the loader runs during navigation (in parallel with any code-splitting/chunk loading for the route), the data is often ready by the time the component actually renders — eliminating the extra spinner-then-content flash that a `useEffect`-based fetch produces on every navigation.
