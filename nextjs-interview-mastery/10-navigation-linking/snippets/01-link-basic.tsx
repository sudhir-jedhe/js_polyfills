// components/nav-links.tsx
// Basic <Link> usage: string href, object href with query, prefetch overrides.

import Link from 'next/link';

export function NavLinks() {
  return (
    <nav>
      <Link href="/">Home</Link>

      <Link href="/blog/hello-world">Blog Post</Link>

      <Link
        href={{
          pathname: '/products',
          query: { sort: 'newest', page: 2 },
        }}
      >
        Newest Products, Page 2
      </Link>

      {/* Long list scenario: disable prefetch to avoid wasting bandwidth */}
      <Link href="/archive/2019" prefetch={false}>
        2019 Archive
      </Link>

      {/* Preserve scroll position instead of jumping to top */}
      <Link href="/dashboard?tab=billing" scroll={false}>
        Billing Tab
      </Link>
    </nav>
  );
}
