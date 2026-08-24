// app/dashboard/layout.tsx
// Nested layout: wraps every route under /dashboard/*.
// Persists across navigation between /dashboard/settings and /dashboard/analytics.
import { DashboardNav } from './DashboardNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>
      <DashboardNav />
      <main>{children}</main>
    </div>
  )
}
