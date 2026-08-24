# Scenario: Users See a Blank White Screen on Slow Connections

Your `/reports` page fetches a large dataset from an internal analytics service before rendering a chart. On fast connections it's fine, but support tickets are coming in from users on slower networks describing a "blank white screen for a few seconds" before the page appears — no spinner, no skeleton, nothing. The page itself works correctly once it loads; there's no error.

**Approach:** This is the classic symptom of a route segment with async Server Component data fetching but no `loading.js`. Without one, Next.js has nothing to show while the `page.tsx`'s `await` is pending — the browser just sits on the previous page (or a blank tab on first load) until the whole segment resolves, because there's no Suspense fallback registered for that boundary.

The fix is simply adding `loading.tsx` next to `page.tsx` in the same route folder — Next.js automatically wraps the segment in `<Suspense fallback={<Loading />}>`, no manual `<Suspense>` wiring required:

```tsx
// app/reports/page.tsx
export default async function ReportsPage() {
  const data = await fetchLargeAnalyticsDataset() // slow on bad connections
  return <ReportsChart data={data} />
}
```

```tsx
// app/reports/loading.tsx
export default function Loading() {
  return (
    <div className="reports-skeleton" aria-busy="true" aria-live="polite">
      <div className="chart-placeholder" />
      <p>Crunching the numbers…</p>
    </div>
  )
}
```

Two follow-ups worth raising with the team while you're in there. First, if `ReportsChart` needs *some* data immediately (say, page title/filters) but the heavy chart data can lag, consider splitting the slow fetch into its own nested async component and wrapping just that piece in a manual `<Suspense>` — that way the header and filters render instantly even while the chart area shows its own inline fallback, rather than blocking the entire page behind one `loading.tsx`. Second, `loading.tsx` fires on every navigation into the segment, including fast repeat visits — if the dataset is cached and returns quickly, users might see a one-frame flash of the skeleton; that's expected and generally preferable to a fully blank screen, but worth calling out so it isn't mistaken for a bug later.
