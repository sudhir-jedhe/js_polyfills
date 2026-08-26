// app/dashboard/template.tsx
// Unlike layout.tsx, template.tsx re-mounts on every navigation:
// state resets and effects re-run each time the route changes.
'use client'

import { useEffect, useState } from 'react'

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const [mountedAt] = useState(() => new Date().toISOString())

  useEffect(() => {
    console.log('Template mounted fresh at', mountedAt)
  }, [mountedAt])

  return <div data-mounted-at={mountedAt}>{children}</div>
}

// Compare: app/dashboard/layout.tsx would NOT re-run this effect
// when navigating between /dashboard/settings and /dashboard/analytics —
// only template.tsx guarantees a fresh mount per navigation.
