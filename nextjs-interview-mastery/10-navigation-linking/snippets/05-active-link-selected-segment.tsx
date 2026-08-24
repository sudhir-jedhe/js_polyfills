'use client';

// app/account/account-tabs.tsx
// useSelectedLayoutSegment for tab-style active state, scoped to the
// layout it's rendered from -- portable if the route tree is restructured.

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

const TABS = [
  { segment: null, label: 'Overview', href: '/account' }, // index route
  { segment: 'billing', label: 'Billing', href: '/account/billing' },
  { segment: 'settings', label: 'Settings', href: '/account/settings' },
];

export function AccountTabs() {
  const activeSegment = useSelectedLayoutSegment();

  return (
    <nav>
      {TABS.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          aria-current={activeSegment === tab.segment ? 'page' : undefined}
          className={activeSegment === tab.segment ? 'active-tab' : 'tab'}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
