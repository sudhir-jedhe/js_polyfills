# A single failing widget takes down the entire app shell. Why?

```
app/
  layout.tsx          <- renders <Sidebar /> and {children}
  dashboard/
    page.tsx            <- renders <RevenueChart />, which throws if the
                            API returns malformed data
  settings/
    page.tsx
  billing/
    page.tsx
```

No `error.tsx` exists anywhere in the app. A malformed API response causes `RevenueChart` (rendered inside `app/dashboard/page.tsx`) to throw during rendering. Users report that navigating to `/settings` or `/billing` afterward also shows a broken/blank page, even though those routes don't render `RevenueChart` at all.

**Answer:** Without an `error.tsx` anywhere in the route tree, an unhandled render error propagates up to the **nearest ancestor Error Boundary** — and with none defined at any route segment level, that's effectively the root of the application, taking down the entire shared shell (`app/layout.tsx`, including the `Sidebar` that every other route depends on) rather than being contained to just `/dashboard`. Once the root-level rendering has crashed, client-side navigation to sibling routes like `/settings` can't function normally either, since the very shell that would host the new route's content is itself in a broken state.

**Why:** This is precisely why "missing error boundary" is a blast-radius problem, not just a missing-nicety: the cost of an unhandled error scales with how high up the tree it has to propagate to find a boundary, and with zero boundaries defined, every error is effectively a root-level error regardless of how deeply nested or narrow its actual cause is. The fix is adding `error.tsx` at the segment where failure is plausible and should be contained — here, specifically `app/dashboard/error.tsx`:

```tsx
// app/dashboard/error.tsx
'use client';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Couldn't load the dashboard.</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

With this in place, a `RevenueChart` failure is caught by the nearest boundary (`app/dashboard/error.tsx`), which replaces only the `/dashboard` route segment's content with a contained error UI — `Sidebar` and the rest of the app shell keep rendering normally, and `/settings`/`/billing` remain fully navigable and unaffected. The general principle: error boundaries should exist at every route segment where a failure is plausible and *shouldn't* be allowed to propagate further up than necessary — not just as a single catch-all at the root.
