# Output: Does the Counter Reset?

```tsx
// app/dashboard/layout.tsx
'use client'
import { useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Clicks: {count}</button>
      <nav>
        <a href="/dashboard/a">A</a>
        <a href="/dashboard/b">B</a>
      </nav>
      {children}
    </div>
  )
}
```

The user clicks the button 3 times (count shows "Clicks: 3"), then clicks the link to `/dashboard/b` using `next/link`'s underlying `<a>` inside a client-navigated app. What does "Clicks:" show immediately after navigating to `/dashboard/b`?

**Answer:** It still shows "Clicks: 3". The layout does not re-render or remount during the client-side navigation between `/dashboard/a` and `/dashboard/b`.

**Why:** `DashboardLayout` wraps both `/dashboard/a` and `/dashboard/b`. Because the layout is shared between the previous and next route, the App Router's client-side router preserves that part of the React tree across the navigation — it only swaps out the `page.tsx` content that changed. `useState` inside a persisted component is not reset, since React never unmounted it. This only holds true for **client-side navigations** performed via `next/link` or `router.push`; a full page reload (hitting refresh, or a hard navigation from outside the app) always remounts everything, including the layout, resetting `count` back to 0.
