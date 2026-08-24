// app/dashboard/layout.tsx
// Parallel routes: @team and @analytics render independently inside
// the same layout, each with its own sub-navigation state.
//
// Folder structure:
//   app/dashboard/layout.tsx
//   app/dashboard/page.tsx
//   app/dashboard/@team/page.tsx
//   app/dashboard/@team/default.tsx   <- fallback when no match
//   app/dashboard/@analytics/page.tsx
//   app/dashboard/@analytics/default.tsx

export default function DashboardLayout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <section>{children}</section>
      <aside>
        <section>{team}</section>
        <section>{analytics}</section>
      </aside>
    </div>
  );
}

// app/dashboard/@team/default.tsx
// Required so refreshing on a sub-route that this slot doesn't match
// doesn't 404 the entire dashboard layout.
export function TeamDefault() {
  return null;
}
