# Scenario: Auto-generated breadcrumbs across an arbitrarily nested settings area

**Problem:** A settings area has deeply nested routes (`/settings/team/members/42/permissions`) and product wants breadcrumbs that reflect the current path automatically, without every new nested page having to manually declare its own breadcrumb entry — as the settings section grows, remembering to update a hardcoded breadcrumb config in multiple places is exactly the kind of thing that silently rots.

**Approach:** Derive breadcrumb segments from `usePathname()`, splitting on `/`, and pair each segment with a human-readable label sourced from a small central map (falling back to a title-cased version of the raw segment for anything not explicitly labeled) — this keeps breadcrumbs correct automatically as routes are added, at the small cost of maintaining the label map for anything that shouldn't just be its raw slug.

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  settings: 'Settings',
  team: 'Team',
  members: 'Members',
  permissions: 'Permissions',
};

function labelFor(segment: string) {
  return LABELS[segment] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname(); // "/settings/team/members/42/permissions"
  const segments = pathname.split('/').filter(Boolean);

  let hrefSoFar = '';

  return (
    <nav aria-label="breadcrumb">
      <Link href="/">Home</Link>
      {segments.map((segment, i) => {
        hrefSoFar += `/${segment}`;
        const isLast = i === segments.length - 1;
        // Numeric IDs (e.g. "42") get a raw display rather than a lookup,
        // and are not linkable on their own since there's no dedicated
        // page for a bare ID segment in this route tree.
        const isId = /^\d+$/.test(segment);
        const label = isId ? `#${segment}` : labelFor(segment);

        return (
          <span key={hrefSoFar}>
            {' / '}
            {isLast || isId ? (
              <span aria-current="page">{label}</span>
            ) : (
              <Link href={hrefSoFar}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
```

A worthwhile follow-up discussion point: this approach requires `usePathname`, so `Breadcrumbs` must be a Client Component. If the label map needs to include dynamic data (e.g., showing the actual member's *name* instead of `#42`), that data has to be fetched server-side and passed down as a prop from the page, since a Client Component reading only the raw pathname has no way to resolve `42` into `"Jordan Lee"` without an extra client-side fetch — an alternative worth raising is composing breadcrumbs from `params` passed down through each nested layout instead of parsing `usePathname`, trading automatic-from-URL simplicity for the ability to inject resolved names at each level.
