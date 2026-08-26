# Lazy-Loading Routes vs. Components

## Route-level splitting

The most common and highest-value application of `React.lazy` is at the route level — each route/page is its own chunk, so navigating to `/settings` doesn't cost anything until the user actually goes there:

```jsx
const Home = React.lazy(() => import("./routes/Home"));
const Settings = React.lazy(() => import("./routes/Settings"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

Always do route-level splitting first — it's close to free with modern routers, and most users only ever visit some routes.

## Component-level splitting

Component-level splitting makes sense for genuinely heavy, conditionally-rendered pieces within a page — a rich text editor, a charting library, a modal that's rarely opened — where the weight isn't justified for every visitor. Add it only for specific, measurably heavy pieces that aren't needed on initial render.

## Comparison

| Aspect | Route-level | Component-level |
|---|---|---|
| Granularity | One chunk per page/route | One chunk per heavy widget/feature |
| Typical win | Biggest bang for buck — most users only visit some routes | Smaller wins, targeted at specific heavy dependencies (editors, charts, maps) |
| Setup complexity | Usually just wrapping route elements in `React.lazy` | Requires identifying which specific components are "heavy enough" to bother |
| Common mistake | Not splitting at all, shipping one monolithic bundle | Splitting too aggressively (tiny components), adding request overhead without meaningful bundle savings |

## React.lazy + Suspense vs. framework-level splitting

Frameworks like Next.js often handle route-level splitting automatically. If you're on a framework with built-in route-based splitting, don't hand-roll `React.lazy` for routes it already handles — reserve manual `React.lazy` for component-level splits the framework doesn't do for you.

| Aspect | Manual `React.lazy` + Suspense | Framework-level (e.g., Next.js automatic route splitting) |
|---|---|---|
| Control | You explicitly choose split points | Often automatic per route/page out of the box |
| Data fetching integration | Not integrated — you still fetch data separately | Frameworks increasingly integrate Suspense with data loading (React Server Components, loaders) |
| Setup | Works in any React 18+ app with a bundler supporting dynamic `import()` | Tied to the framework's conventions and build pipeline |
| Common mistake | Manually re-implementing what the framework already does automatically for routes | Assuming the framework's data-Suspense integration generalizes to plain client-side `useEffect` fetching, which it doesn't |
