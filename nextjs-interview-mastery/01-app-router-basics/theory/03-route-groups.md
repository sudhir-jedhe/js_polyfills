# Route Groups: Organizing Without Affecting the URL

A route group is a folder whose name is wrapped in parentheses — `(marketing)`, `(app)`, `(auth)`. Next.js treats the parentheses as a signal to **omit that segment from the URL entirely** while still using the folder for organization, shared layouts, and code colocation.

```
app/
  (marketing)/
    layout.tsx        (marketing chrome: nav, footer, promo banner)
    page.tsx            -> /
    about/
      page.tsx           -> /about
    pricing/
      page.tsx           -> /pricing
  (app)/
    layout.tsx        (authenticated app shell: sidebar, no marketing footer)
    dashboard/
      page.tsx           -> /dashboard
    settings/
      page.tsx           -> /settings
```

Note the URLs: `/about` and `/dashboard`, not `/(marketing)/about` or `/(app)/dashboard`. The group folder is purely a filesystem/organizational device.

The two most common reasons to reach for route groups:

**1. Multiple root layouts.** Without route groups, you get exactly one root `app/layout.tsx` for the entire app. If your marketing site and authenticated app need fundamentally different `<html>`/`<body>` shells (different fonts, different global nav, maybe even no shared chrome at all), you move `app/layout.tsx` out and give each group its own root layout:

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="marketing-theme">
        <MarketingNav />
        {children}
        <MarketingFooter />
      </body>
    </html>
  )
}
```

```tsx
// app/(app)/layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-theme">
        <AppSidebar />
        {children}
      </body>
    </html>
  )
}
```

When you do this, every route must belong to exactly one group with a root layout — Next.js will error at build time if a route isn't covered by any `<html>`-defining layout.

**2. Organization without layout sharing.** Sometimes you just want to group related routes in the file tree without introducing a shared layout at all — e.g., separating `(shop)` and `(support)` sections of a single app that both still use the same root layout. You simply omit a `layout.tsx` inside the group folder.

A gotcha worth knowing: **two different route groups can define the same URL segment**, which will cause a build error if they'd resolve to the same path (e.g., both `(marketing)/pricing/page.tsx` and `(app)/pricing/page.tsx` would both try to own `/pricing`) — Next.js requires exactly one page per unique URL. Route groups don't create URL namespacing; they only affect the filesystem, so URL uniqueness rules still apply across all groups combined.
