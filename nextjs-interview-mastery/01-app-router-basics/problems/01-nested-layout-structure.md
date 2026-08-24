# Problem 1: Build a Nested Layout Structure

## Task

Build a route structure with:

- A root layout (`app/layout.tsx`) with a global header showing "MyApp".
- A dashboard layout (`app/dashboard/layout.tsx`) with a sidebar containing links to "Overview" (`/dashboard`) and "Team" (`/dashboard/team`), plus a client-side counter button (`useState`) labeled "Notifications: N" that increments on click.
- Two dashboard pages: `app/dashboard/page.tsx` ("Overview" content) and `app/dashboard/team/page.tsx` ("Team" content).
- A completely separate top-level route, `app/about/page.tsx`, not nested under `dashboard/`.

## Requirements

1. Implement all files described above with correct conventions.
2. Write a short explanation (as a code comment or markdown block) answering: **what re-renders** when navigating from `/dashboard` to `/dashboard/team` via `next/link`, versus navigating from `/dashboard/team` to `/about`?

## Starter shape

```
app/
  layout.tsx
  about/
    page.tsx
  dashboard/
    layout.tsx
    page.tsx
    team/
      page.tsx
```

## Solution

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>MyApp</header>
        {children}
      </body>
    </html>
  )
}
```

```tsx
// app/dashboard/layout.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState(0)

  return (
    <div style={{ display: 'flex' }}>
      <aside>
        <nav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/team">Team</Link>
        </nav>
        <button onClick={() => setNotifications((n) => n + 1)}>
          Notifications: {notifications}
        </button>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

```tsx
// app/dashboard/page.tsx
export default function DashboardOverview() {
  return <h1>Overview</h1>
}
```

```tsx
// app/dashboard/team/page.tsx
export default function TeamPage() {
  return <h1>Team</h1>
}
```

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return <h1>About</h1>
}
```

**Explanation:**
- `/dashboard` → `/dashboard/team`: `DashboardLayout` (including the sidebar and the `Notifications: N` counter's current value) does **not** re-render — it's shared by both routes. Only the `page.tsx` content swaps from "Overview" to "Team". If the user had clicked the notifications button 5 times before navigating, it still reads "Notifications: 5" afterward.
- `/dashboard/team` → `/about`: `DashboardLayout` unmounts entirely, since `/about` doesn't share it — it's a sibling route outside `dashboard/`. The notifications counter resets to 0 if the user later navigates back into `/dashboard`, because a fresh `DashboardLayout` instance is mounted. The root layout (`MyApp` header) persists through both navigations, since every route shares it.
