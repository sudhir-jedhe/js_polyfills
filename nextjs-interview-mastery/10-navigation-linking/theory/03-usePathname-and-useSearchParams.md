# `usePathname()` and `useSearchParams()`

These two hooks read the current URL client-side — one for the path, one for the query string — and both share the same critical constraint that trips up nearly everyone the first time they use it: **they only work in Client Components**, and `useSearchParams` specifically has an additional Suspense requirement that `usePathname` doesn't.

## `usePathname()`

```tsx
'use client';

import { usePathname } from 'next/navigation';

export function ActiveNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
      {children}
    </Link>
  );
}
```

Returns the current URL's path as a plain string (e.g., `/dashboard/settings`), excluding the query string and hash. It updates automatically on navigation, re-rendering the component. There's no server-side equivalent hook — a Server Component already implicitly "knows" the current path via how it's being rendered, but there's no hook to query it generically outside of `params` (which only gives the dynamic segment values, not the full literal path string).

## `useSearchParams()`

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export function SortIndicator() {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') ?? 'default';
  return <span>Sorted by: {sort}</span>;
}
```

Returns a read-only `URLSearchParams`-like object for the current query string. Like `usePathname`, it's Client-Component only. Unlike `usePathname`, using `useSearchParams` in a component **de-opts that part of the tree into client-side rendering that requires a Suspense boundary** during static rendering — if a statically-rendered page includes a Client Component calling `useSearchParams` without being wrapped in `<Suspense>`, Next.js will either fail the build or (in some configurations) fall back to fully client-side rendering the entire page, defeating server rendering benefits. The framework requires the Suspense boundary so it can stream a fallback for the parts of the UI that genuinely depend on query-string-at-request-time, while everything outside the boundary can still be served from the static shell.

```tsx
// app/products/page.tsx (Server Component)
import { Suspense } from 'react';
import { SortIndicator } from './sort-indicator'; // Client Component

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<span>Sorted by: —</span>}>
        <SortIndicator />
      </Suspense>
    </div>
  );
}
```

## The common gotcha, spelled out

Two separate mistakes produce the same symptom (a build error or a console warning about "missing Suspense boundary"):

1. Forgetting `'use client'` entirely — `useSearchParams`/`usePathname` are undefined or throw outside a Client Component.
2. Having `'use client'` correctly, but not wrapping the component (or an ancestor) in `<Suspense>` when the page is otherwise statically rendered — this is subtler because the component *works* in isolation during local dev but fails or behaves unexpectedly once you build for production, since dev mode is more forgiving about when things get evaluated.

The fix for #2 is always to push the `useSearchParams()` call into the smallest possible leaf Client Component and wrap just that component in `<Suspense>`, rather than making an entire large page a Client Component to sidestep the boundary requirement — that would needlessly forfeit server rendering for content that has nothing to do with the query string.
