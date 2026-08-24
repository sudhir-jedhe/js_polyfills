// File-system convention for loading and error boundaries, scoped to
// a single route segment -- no manual <Suspense>/<ErrorBoundary> wiring.

// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="skeleton skeleton-header" />
      <div className="skeleton skeleton-chart" />
      <div className="skeleton skeleton-table" />
    </div>
  );
}

// app/dashboard/error.tsx
'use client'; // error.tsx must be a Client Component

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error-reporting service; error.digest correlates with
    // the server-side log entry for this specific failure.
    console.error('Dashboard failed to render:', error.digest, error.message);
  }, [error]);

  return (
    <div role="alert">
      <h2>Something went wrong loading the dashboard.</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/dashboard/page.tsx
async function getDashboardData() {
  const res = await fetch('https://api.example.com/dashboard', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load dashboard data');
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <div>{/* render data */}</div>;
}
