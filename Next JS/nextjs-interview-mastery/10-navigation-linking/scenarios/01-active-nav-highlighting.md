# Scenario: Sidebar navigation that highlights the current section, including nested routes

**Problem:** A dashboard sidebar has top-level links (`/dashboard`, `/dashboard/reports`, `/dashboard/settings`), and `/dashboard/settings` itself has further nested pages (`/dashboard/settings/profile`, `/dashboard/settings/billing`). The sidebar's "Settings" link needs to appear highlighted whenever the user is anywhere under `/dashboard/settings/*`, not just on the exact `/dashboard/settings` URL — an exact-match check would leave "Settings" unhighlighted while viewing the profile sub-page, which reads as broken navigation to users.

**Approach:** Use `usePathname()` with a `startsWith` prefix check rather than exact equality, being careful about the one edge case that breaks naive prefix matching: the top-level `/dashboard` link itself would also match `startsWith('/dashboard')` for every nested route, incorrectly highlighting both "Dashboard" and "Settings" simultaneously.

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Overview', exact: true },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav>
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={isActive ? 'active' : ''}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

The `exact: true` flag on the top-level "Overview" link, plus checking `startsWith(link.href + '/')` (with the trailing slash) rather than bare `startsWith(link.href)`, prevents `/dashboard/settings` from incorrectly matching a hypothetical `/dashboard-archive` link — the trailing slash makes the prefix check segment-aware rather than a raw string prefix. For deeply nested tab structures scoped to a single layout, `useSelectedLayoutSegment`/`useSelectedLayoutSegments` (see the dedicated theory file) is often a cleaner alternative to manual pathname parsing, since it's relative to the layout rather than requiring hardcoded path prefixes.
