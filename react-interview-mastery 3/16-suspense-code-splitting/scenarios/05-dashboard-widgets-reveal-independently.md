# Product Wants a "Data Is Ready, Then Reveal" Feel for a Dashboard, Not a Spinner-Then-Pop

Design wants dashboard widgets to load in gracefully rather than showing spinners that pop away abruptly, and wants slow widgets to not block fast ones from appearing.

**Approach:** Give each independently-loading widget its own nested Suspense boundary so fast widgets appear as soon as they're ready without waiting on slow ones, and use skeleton placeholders sized like the real content instead of centered spinners to reduce layout shift.

```jsx
const RevenueWidget = React.lazy(() => import("./widgets/Revenue"));
const TrafficWidget = React.lazy(() => import("./widgets/Traffic"));
const ChurnWidget = React.lazy(() => import("./widgets/Churn"));

function Dashboard() {
  return (
    <div className="grid">
      <Suspense fallback={<WidgetSkeleton />}>
        <RevenueWidget />
      </Suspense>
      <Suspense fallback={<WidgetSkeleton />}>
        <TrafficWidget />
      </Suspense>
      <Suspense fallback={<WidgetSkeleton />}>
        <ChurnWidget />
      </Suspense>
    </div>
  );
}
```

Each widget suspends and resolves independently, matching the "reveal as ready, don't block on the slowest" requirement — a single shared boundary here would have made every widget wait for the slowest one.
