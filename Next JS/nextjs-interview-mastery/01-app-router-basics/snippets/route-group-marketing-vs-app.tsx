// File tree:
// app/
//   (marketing)/
//     layout.tsx     -> only wraps marketing pages, URL unaffected
//     page.tsx        -> renders at "/"
//     pricing/page.tsx -> renders at "/pricing"
//   (app)/
//     layout.tsx     -> only wraps app pages, URL unaffected
//     dashboard/page.tsx -> renders at "/dashboard"

// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-shell">
      <PromoBanner />
      {children}
    </div>
  )
}

// app/(app)/layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      {children}
    </div>
  )
}

function PromoBanner() {
  return <div>50% off this week only</div>
}

function Sidebar() {
  return <aside>App Sidebar</aside>
}
