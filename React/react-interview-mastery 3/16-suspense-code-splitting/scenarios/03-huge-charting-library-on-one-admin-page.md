# A Third-Party Charting Library Is Huge and Only Used on One Admin Report

The main bundle includes a charting library (~300KB gzipped) that's only rendered on a single infrequently-visited admin analytics page, inflating load time for every user including ones who never see a chart.

**Approach:** Lazy-load the chart component specifically, not the whole admin page (if the admin page has other lightweight content worth showing immediately), and add a skeleton fallback matching the chart's dimensions to avoid layout shift.

```jsx
const RevenueChart = React.lazy(() => import("./charts/RevenueChart"));

function AdminAnalytics({ data }) {
  return (
    <div>
      <h1>Analytics</h1>
      <SummaryStats data={data} />
      <ErrorBoundary fallback={<p>Chart failed to load.</p>}>
        <Suspense fallback={<ChartSkeleton height={400} />}>
          <RevenueChart data={data} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

`SummaryStats` renders immediately since it doesn't depend on the heavy library; only the chart itself is deferred and isolated, keeping the rest of the page responsive.
