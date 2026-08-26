# Users on Slow Connections See a Jarring Blank Screen During Route Transitions

Your app is a single-page app with lazily-loaded routes. Users report that clicking a nav link causes the whole screen to go blank for a moment before the new page pops in, which feels broken rather than "loading."

**Approach:** The blank screen is the Suspense fallback rendering `null` or an under-designed fallback, and possibly a boundary placed too high (wrapping the whole app, wiping out the still-valid old page instead of transitioning gracefully). Two fixes: give the fallback real skeleton UI instead of a blank/spinner-only state, and consider `useTransition` (React 18) to keep the old route visible while the new one loads instead of unmounting immediately.

```jsx
const Settings = React.lazy(() => import("./routes/Settings"));

function AppRoutes() {
  const [isPending, startTransition] = useTransition();
  const [route, setRoute] = useState("home");

  function navigate(next) {
    startTransition(() => setRoute(next));
  }

  return (
    <div style={{ opacity: isPending ? 0.6 : 1 }}>
      <Suspense fallback={<PageSkeleton />}>
        {route === "home" && <Home />}
        {route === "settings" && <Settings />}
      </Suspense>
    </div>
  );
}
```

`startTransition` marks the route change as non-urgent, so React keeps showing the current page (dimmed via `isPending`) instead of immediately unmounting it for the fallback, avoiding the jarring blank-screen flash.
