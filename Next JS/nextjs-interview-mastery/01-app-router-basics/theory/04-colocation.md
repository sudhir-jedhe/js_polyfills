# Colocation: Keeping Route-Specific Code Next to Its Route

Before the App Router, Next.js required everything under `pages/` to be a route — you couldn't drop a helper component in that folder without it becoming an accidental page. The App Router flips this: **only files matching a reserved convention name are special**. Everything else in a route folder — components, hooks, utilities, tests, CSS Modules, constants — is just a regular file that Next.js ignores for routing purposes.

```
app/
  dashboard/
    page.tsx                    <- routable: /dashboard
    layout.tsx                  <- routable convention
    loading.tsx                 <- routable convention
    DashboardChart.tsx           <- NOT routable, safe to colocate
    DashboardChart.test.tsx      <- NOT routable, safe to colocate
    dashboard.module.css         <- NOT routable, safe to colocate
    utils.ts                     <- NOT routable, safe to colocate
    hooks/
      useDashboardFilters.ts     <- entire folder ignored unless it has a page.tsx
```

This is a genuine ergonomic win: you can keep a feature's page, its presentational subcomponents, its tests, and its styles in one folder instead of splitting them across `pages/`, `components/`, `styles/`, and `__tests__/` trees that mirror each other by convention alone. When you delete a feature, you delete one folder — nothing gets orphaned elsewhere in the codebase.

The reserved names you need to avoid accidentally colliding with are the special files themselves (`page`, `layout`, `loading`, `error`, `not-found`, `template`, `route`, `default`) plus a few less common ones (`global-error.js`, `route.js` for Route Handlers, and the parallel-route `@slot` / intercepting-route `(.)folder` conventions). Anything else — including nested folders that don't themselves contain a `page.js` — is safe to use for organization without becoming routable.

```tsx
// app/dashboard/DashboardChart.tsx — colocated, not a route
'use client'

export function DashboardChart({ points }: { points: number[] }) {
  return <svg>{/* render points */}</svg>
}
```

```tsx
// app/dashboard/page.tsx
import { DashboardChart } from './DashboardChart'
import { getMetrics } from './utils'

export default async function DashboardPage() {
  const metrics = await getMetrics()
  return <DashboardChart points={metrics.points} />
}
```

A common pattern for larger shared pieces is a top-level `_components/`, `_lib/`, or any underscore-prefixed folder. The leading underscore is itself a Next.js convention — it explicitly opts a folder (and everything below it) out of routing, which is useful for private implementation folders that might otherwise accidentally contain a file that collides with a route segment name (e.g., a folder literally named `page` used for something unrelated). Underscore-prefixed folders are excluded even if you nest a `page.js` inside them by mistake, which makes them a safer default for shared, non-routable code than relying purely on "just don't add a page.js here."
