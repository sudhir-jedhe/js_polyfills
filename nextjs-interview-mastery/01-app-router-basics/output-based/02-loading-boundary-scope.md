# Output: Which loading.js Fires?

```
app/
  dashboard/
    loading.tsx          <- "Loading dashboard shell..."
    layout.tsx
    page.tsx               (fast, no data fetching)
    reports/
      loading.tsx         <- "Loading reports..."
      page.tsx              (slow: awaits a 2s fetch)
```

A user navigates directly to `/dashboard/reports` (first load in the session, not a client transition from `/dashboard`). Which loading UI appears, and in what order, if any?

**Answer:** Only "Loading reports..." appears. "Loading dashboard shell..." never shows for this navigation.

**Why:** Each `loading.js` creates a Suspense boundary around the segment it's defined in (and everything nested below it that doesn't have its own closer `loading.js`). Because `/dashboard/reports` has its own `loading.tsx`, that becomes the closest boundary to the slow `page.tsx`, and it "wins" — Next.js doesn't also show the parent's `loading.tsx` above it for this navigation, since the parent segment (`dashboard/page.tsx`) itself has no async work causing it to suspend. If `dashboard/page.tsx` were also slow, both boundaries could theoretically be relevant, but React would still only suspend at the nearest boundary that wraps the slow work — the dashboard shell around it (nav, static markup) would render immediately since it doesn't depend on the reports data. The general rule: `loading.js` only activates for the segment whose async rendering it's the *nearest* ancestor of.
