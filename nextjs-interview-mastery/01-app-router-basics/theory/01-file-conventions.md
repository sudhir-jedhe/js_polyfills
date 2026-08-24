# App Router File Conventions

The App Router (introduced in Next.js 13, stable and default-recommended since 13.4) replaces "one file = one route" with a **folder-based, convention-driven** routing model. Every route lives in a folder under `app/`, and the folder's *content*, not its name alone, determines what that segment renders. The URL path is derived from the folder nesting; special filenames inside each folder plug into specific parts of the render tree.

The core conventions you must know cold:

- **`page.js` (or `.tsx`)** — makes a route segment publicly accessible and renders the UI for that exact URL. A folder without a `page.js` is *not* a navigable route — it's purely structural (useful for layouts or route groups).
- **`layout.js`** — wraps a segment and all its nested segments in shared UI. Layouts **preserve state and do not re-render** on navigation between sibling routes that share them — this is the single most-tested App Router concept.
- **`loading.js`** — an automatic Suspense boundary. Next.js wraps `page.js` (and everything below it) in `<Suspense fallback={<Loading />}>`, so this file shows instantly while the segment's data-fetching Server Components are still resolving.
- **`error.js`** — a Client Component error boundary for the segment. It must be `"use client"` and catches errors thrown during rendering in that segment and below, without crashing the whole app.
- **`not-found.js`** — rendered when `notFound()` is called or a segment can't be matched. It's a static boundary, not a full error boundary.
- **`template.js`** — like a layout, but it re-mounts (fresh state, re-run effects) on every navigation, instead of persisting. Rare in practice — reach for it only when you explicitly need per-navigation remounts (e.g., re-triggering an enter animation).

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="dashboard-shell">
      <DashboardNav />
      {children}
    </section>
  )
}
```

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />
}
```

```tsx
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div role="alert">
      <p>Something went wrong loading the dashboard.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

A key mental model shift from the Pages Router: these files compose **per segment**, and Next.js automatically nests the special files into an implicit component tree — roughly `Layout > Template > ErrorBoundary > Suspense(loading) > NotFoundBoundary > Page` — for every folder that has a `page.js`. You rarely need to think about that tree explicitly, but understanding it explains *why* `loading.js` can show while `error.js` for the same segment stays inert (they wrap different parts of the tree), and why a `loading.js` higher up doesn't block a `page.js` several levels down that has its own `loading.js`.

Colocation is fully supported: only files matching these reserved names (or exported route handlers like `route.js`) become part of routing. You can freely place components, hooks, tests, and CSS Modules directly next to `page.js` in the same folder — nothing else in that folder is routable.
