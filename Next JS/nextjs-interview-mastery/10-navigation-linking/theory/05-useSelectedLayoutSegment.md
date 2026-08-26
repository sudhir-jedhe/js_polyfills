# `useSelectedLayoutSegment` for Active-Link Styling

`usePathname()` is the general-purpose tool for "what's the current URL," but inside a layout that needs to know specifically which of *its own child routes* is active — without caring about the rest of the URL above or below it — `useSelectedLayoutSegment` (and its plural cousin `useSelectedLayoutSegments`) is a more targeted, layout-scoped alternative.

## Basic usage

```tsx
'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { segment: 'overview', label: 'Overview' },
  { segment: 'billing', label: 'Billing' },
  { segment: 'settings', label: 'Settings' },
];

export function AccountTabs() {
  const activeSegment = useSelectedLayoutSegment();

  return (
    <nav>
      {tabs.map((tab) => (
        <Link
          key={tab.segment}
          href={`/account/${tab.segment}`}
          aria-current={activeSegment === tab.segment ? 'page' : undefined}
          className={activeSegment === tab.segment ? 'active-tab' : ''}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
```

Called from within `app/account/layout.tsx` (or a Client Component rendered by it), `useSelectedLayoutSegment()` returns the name of the **immediate child segment** currently active — `'overview'`, `'billing'`, or `'settings'` — as a plain string, or `null` if the layout's own index route (`app/account/page.tsx`) is active with no further nested segment.

## Why not just `usePathname()` here?

```tsx
// With usePathname, you'd have to manually parse:
const pathname = usePathname(); // "/account/billing"
const segment = pathname.split('/')[2]; // brittle, breaks if layout moves
```

`useSelectedLayoutSegment` avoids this string-parsing fragility. It's relative to *where the layout lives in the tree*, so if you later mount the same layout+tabs component under a different parent path (say, moving `/account` to `/settings/account`), the segment logic keeps working unchanged — `usePathname`-based parsing would need updating to match the new path depth.

## `useSelectedLayoutSegments` (plural) for nested breadcrumbs

```tsx
'use client';
import { useSelectedLayoutSegments } from 'next/navigation';

export function Breadcrumbs() {
  const segments = useSelectedLayoutSegments(); // e.g. ['billing', 'invoices', '42']
  return (
    <nav>
      {segments.map((s, i) => (
        <span key={i}> / {s}</span>
      ))}
    </nav>
  );
}
```

This returns an array of all active segments *below* the layout it's called from, useful for breadcrumb trails that need the full remaining path depth, not just the immediate next segment.

## Parallel route slots

Both hooks accept an optional `parallelRoutesKey` argument for reading the active segment of a specific named slot (`useSelectedLayoutSegment('modal')`), since a layout with multiple parallel slots doesn't have a single unambiguous "active segment" otherwise — each slot navigates independently and needs its own query into the hook.

In an interview, the sharp point to make: `useSelectedLayoutSegment` isn't functionally different from correctly parsing `usePathname()`, but it's the *correct abstraction level* — it ties active-state logic to the layout's position in the route tree rather than to a hardcoded string index into the full path, making tab/nav components portable and resistant to route restructuring.
