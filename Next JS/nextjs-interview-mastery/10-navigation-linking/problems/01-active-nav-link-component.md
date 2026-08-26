# Problem 1: Active navigation link component

## Task

Implement a reusable `<ActiveNavLink>` Client Component using `usePathname()` that:

1. Renders a `<Link>` with the given `href`.
2. Applies an "active" style/class when the current route matches.
3. Handles the top-level "Home" (`/`) link correctly — it should be active ONLY on the exact `/` path, never as a prefix match for every other route (a naive `startsWith('/')` would match everything).
4. Handles nested routes correctly — a link to `/dashboard/settings` should be considered active for both `/dashboard/settings` itself and any deeper nested path like `/dashboard/settings/billing`, but NOT for an unrelated sibling route that happens to share a text prefix, like `/dashboard/settings-legacy`.
5. Sets `aria-current="page"` (not just a CSS class) when active, for accessibility.

## Starter shape

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ActiveNavLink({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  // fill in
}
```

## Self-check

- Does `<ActiveNavLink href="/" exact>Home</ActiveNavLink>` stay inactive while visiting `/dashboard`?
- Does `<ActiveNavLink href="/dashboard/settings">Settings</ActiveNavLink>` correctly activate on `/dashboard/settings/billing`?
- Does the same link correctly stay inactive on `/dashboard/settings-legacy` (prefix string match without a segment-boundary check would incorrectly activate it)?
- Is `aria-current="page"` present only when active, and absent (not `"false"`) otherwise?
