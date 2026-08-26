# Scenario: One Codebase, Two Completely Different Shells

Your startup has a marketing site (`/`, `/pricing`, `/about`, `/blog`) built with a light theme, a top nav, and a footer, and a logged-in app (`/dashboard`, `/settings`, `/billing`) with a dark theme, a persistent sidebar, and no footer at all. Currently everything shares one root `layout.tsx` with a bunch of conditional logic checking `usePathname()` to decide which nav/footer to show, which is getting unmaintainable and forces the whole shell to be a Client Component.

**Approach:** This is the textbook case for route groups with multiple root layouts. Split the two sections into `(marketing)` and `(app)` route groups, each with its own root layout defining its own `<html>`/`<body>`, and delete the root `app/layout.tsx` entirely (Next.js requires each route to resolve to exactly one root layout, so once you have per-group root layouts you can't also keep a top-level one).

```
app/
  (marketing)/
    layout.tsx     <- <html>, light theme, MarketingNav, MarketingFooter
    page.tsx
    pricing/page.tsx
    about/page.tsx
    blog/page.tsx
  (app)/
    layout.tsx     <- <html>, dark theme, AppSidebar, no footer
    dashboard/page.tsx
    settings/page.tsx
    billing/page.tsx
```

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
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
    <html lang="en" data-theme="dark">
      <body>
        <AppSidebar />
        {children}
      </body>
    </html>
  )
}
```

This eliminates the `usePathname()` branching entirely — each layout is a plain Server Component now, since it no longer needs to inspect the current path to decide what to render; the file location itself encodes that decision. It also means each shell can be its own bundle boundary: the marketing shell never ships sidebar code, and the app shell never ships footer/promo-banner code. The URLs are unaffected — `/pricing` and `/dashboard` look exactly the same to users and search engines as before; only the internal file organization and rendering logic changed.
