# Why does the "Overview" tab never get highlighted?

```tsx
'use client';
import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';

const TABS = [
  { segment: 'overview', label: 'Overview', href: '/account/overview' },
  { segment: 'billing', label: 'Billing', href: '/account/billing' },
];

export function AccountTabs() {
  const activeSegment = useSelectedLayoutSegment();
  return (
    <nav>
      {TABS.map((tab) => (
        <Link
          key={tab.segment}
          href={tab.href}
          className={activeSegment === tab.segment ? 'active' : ''}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
```

Folder structure:
```
app/account/
  layout.tsx     <- renders <AccountTabs />
  page.tsx        <- the "overview" / index route, lives at /account
  billing/
    page.tsx
```

Visiting `/account` (the index route) never highlights "Overview," while `/account/billing` correctly highlights "Billing."

**Answer:** `useSelectedLayoutSegment()` returns `null` — not `'overview'` — when the layout's own index route (`app/account/page.tsx`, reached at the bare `/account` URL) is the active route, because there's no *named* child segment in that case; `app/account/page.tsx` isn't inside a folder called `overview`, it's the layout's direct index page. The `TABS` array's entry for the index page is incorrectly configured with `segment: 'overview'` instead of `segment: null`, so the `activeSegment === tab.segment` check (`null === 'overview'`) is always false for that tab.

**Why:** This is a mismatch between the *URL structure the developer wants* (`/account/overview` as a distinct route) and the *actual folder structure* (no `overview/` folder exists — the index page lives directly at `app/account/page.tsx`, reached via `/account`). Two valid fixes: either change the `TABS` config to `{ segment: null, label: 'Overview', href: '/account' }` to match the real structure, or — if `/account/overview` as an explicit URL is actually desired — create a real `app/account/overview/page.tsx` folder (and likely redirect bare `/account` to it) so the segment genuinely exists. The deeper lesson: `useSelectedLayoutSegment`'s `null` return for "the layout's own index route is active" isn't an edge case to special-case defensively — it's the expected, documented value, and any tab/nav config list needs an explicit entry for it.
