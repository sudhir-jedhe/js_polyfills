# Problem 3: Organize with Route Groups

## Task

Build a route structure where:

- `(marketing)` route group contains: `/` (home), `/pricing`, `/about` — all sharing a `MarketingLayout` with a promo banner and public nav.
- `(app)` route group contains: `/dashboard`, `/settings` — all sharing an `AppLayout` with a sidebar, no promo banner.
- Confirm none of the group folder names ("marketing", "app") appear anywhere in the final URLs.

## Solution

```
app/
  (marketing)/
    layout.tsx
    page.tsx           -> "/"
    pricing/
      page.tsx           -> "/pricing"
    about/
      page.tsx            -> "/about"
  (app)/
    layout.tsx
    dashboard/
      page.tsx            -> "/dashboard"
    settings/
      page.tsx             -> "/settings"
```

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="promo-banner">Free trial ends soon!</div>
      <nav>
        <a href="/">Home</a>
        <a href="/pricing">Pricing</a>
        <a href="/about">About</a>
      </nav>
      {children}
    </div>
  )
}
```

```tsx
// app/(marketing)/page.tsx
export default function HomePage() {
  return <h1>Welcome</h1>
}

// app/(marketing)/pricing/page.tsx
export default function PricingPage() {
  return <h1>Pricing</h1>
}

// app/(marketing)/about/page.tsx
export default function AboutPage() {
  return <h1>About Us</h1>
}
```

```tsx
// app/(app)/layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <aside>
        <a href="/dashboard">Dashboard</a>
        <a href="/settings">Settings</a>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

```tsx
// app/(app)/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>
}

// app/(app)/settings/page.tsx
export default function SettingsPage() {
  return <h1>Settings</h1>
}
```

**Verification:** Visiting `/` renders `HomePage` wrapped in `MarketingLayout`; visiting `/dashboard` renders `DashboardPage` wrapped in `AppLayout`. Neither `(marketing)` nor `(app)` ever appears in the address bar — parentheses signal to Next.js's router to strip that segment from the URL while still using the folder to scope the layout and colocate related routes. Note also that this example still relies on a single shared root `app/layout.tsx` (not shown, assumed to exist above both groups) — if you wanted fully independent `<html>` shells per group, you'd move the root layout responsibility into `(marketing)/layout.tsx` and `(app)/layout.tsx` directly instead, as covered in the theory notes.
