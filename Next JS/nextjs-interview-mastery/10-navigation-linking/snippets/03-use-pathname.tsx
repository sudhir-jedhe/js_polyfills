'use client';

// components/active-nav-link.tsx
// usePathname for highlighting the current route. No Suspense boundary
// required (unlike useSearchParams) since the path is always known
// synchronously client-side once this component mounts.

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ActiveNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Exact match for the home route; startsWith for nested sections
  // so /dashboard/settings still highlights the "Dashboard" link.
  const isActive =
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      style={{ fontWeight: isActive ? 700 : 400 }}
    >
      {children}
    </Link>
  );
}
