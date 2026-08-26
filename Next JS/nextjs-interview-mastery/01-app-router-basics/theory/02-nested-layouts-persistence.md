# Nested Layouts and Persistence Across Navigation

Layouts are the App Router's answer to "why did my sidebar re-mount and lose scroll position every time I clicked a link?" In the App Router, layouts persist by default — they are **not** re-rendered when you navigate between routes that share them. Only the segment that actually changes (typically the innermost `page.js`) re-renders.

Consider this structure:

```
app/
  layout.tsx              (root layout)
  dashboard/
    layout.tsx             (dashboard layout)
    page.tsx                (/dashboard)
    settings/
      page.tsx               (/dashboard/settings)
    analytics/
      page.tsx               (/dashboard/analytics)
```

Navigating from `/dashboard/settings` to `/dashboard/analytics`:

- The **root layout** does not re-render (it wraps everything, and neither URL leaves it).
- The **dashboard layout** does not re-render — it's shared by both routes. Any client state inside it (an open dropdown, a scroll position, a `useState` counter in `DashboardNav`) survives.
- Only the **`page.tsx`** content swaps — React reconciles the tree, unmounting the old page's subtree and mounting the new one.

This is why layouts are the correct place for persistent UI chrome: navigation, sidebars, tab bars, WebSocket connections, or anything that shouldn't reset on every click. Contrast this with navigating from `/dashboard/analytics` to `/marketing` (assuming it's a fully separate top-level route not under `dashboard/`): the dashboard layout unmounts entirely because it's no longer part of the matched route tree, and any state inside it is lost.

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // DashboardNav mounts once and persists across /dashboard/* navigations
  return (
    <div className="grid grid-cols-[240px_1fr]">
      <DashboardNav />
      <main>{children}</main>
    </div>
  )
}
```

Each layout receives a `children` prop that Next.js fills in with the next matched segment — which might be another layout (nested layouts compose recursively) or the final `page.js`. Layouts **cannot** access route params of segments below them directly as props in the same way pages can via `params`, though they do receive their own segment's `params`.

One subtlety worth internalizing for interviews: layouts are Server Components by default and cannot use `usePathname()` or other client-only hooks unless marked `"use client"`. Also, layouts **cannot** access the search params of the page — `useSearchParams()` requires a Client Component, and even then, only `page.js` receives `searchParams` as a prop directly from Next.js. This is intentional: it keeps layouts stable across query-string-only navigations, reinforcing the "layouts persist" contract — if layouts re-rendered on every query param change, they'd lose their main benefit.

The practical takeaway: design your `layout.js` boundaries around what UI genuinely needs to survive navigation, and push anything that should reset (page-specific animations, fresh data per param) down into `page.js` or `template.js`.
