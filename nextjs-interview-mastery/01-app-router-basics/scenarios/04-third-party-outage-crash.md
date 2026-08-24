# Scenario: A Third-Party API Outage Takes Down the Entire App

Your `/dashboard` page renders a widget that calls a third-party weather API as part of its Server Component render. One day that API goes down entirely, starts throwing, and support reports that the *entire app* — not just the weather widget, not just `/dashboard` — shows Next.js's generic error screen. Even `/settings`, which has nothing to do with weather, appears broken for some users navigating client-side from a crashed `/dashboard`.

**Approach:** The full-app failure means there's no `error.tsx` anywhere between the throwing component and the root, so the error is bubbling all the way up to `app/global-error.tsx` (or the built-in default if that's also missing) — which replaces the *entire* root layout, including navigation, because `global-error.tsx` is the one boundary that sits outside even the root layout.

The immediate fix is scoping an `error.tsx` to exactly where the risk lives — the dashboard segment — so a failure there can't escape past it:

```tsx
// app/dashboard/error.tsx
'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div role="alert">
      <p>We couldn't load part of your dashboard. The rest of the app still works.</p>
      <button onClick={() => reset()}>Retry this section</button>
    </div>
  )
}
```

But the better fix is to isolate the risky widget itself, rather than let it take down the whole `/dashboard` page. Move the weather fetch into its own async component with a dedicated `<Suspense>` boundary and wrap *that* boundary's errors separately (e.g., via a client-side error boundary component around just the widget, since React's built-in error boundaries can catch errors from Suspense children):

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { WeatherWidget } from './WeatherWidget'
import { WidgetErrorBoundary } from './WidgetErrorBoundary'

export default function DashboardPage() {
  return (
    <div>
      <DashboardMetrics />
      <WidgetErrorBoundary fallback={<p>Weather unavailable right now.</p>}>
        <Suspense fallback={<p>Loading weather…</p>}>
          <WeatherWidget />
        </Suspense>
      </WidgetErrorBoundary>
    </div>
  )
}
```

This way, `DashboardMetrics` and the rest of the dashboard keep rendering and remain interactive even during a full third-party outage — only the small widget area degrades gracefully. The general lesson: place `error.tsx` boundaries (and, for finer granularity, manual client error boundaries around specific components) at the smallest scope that makes sense for the blast radius you're willing to tolerate, rather than relying on one boundary far up the tree to catch everything.
