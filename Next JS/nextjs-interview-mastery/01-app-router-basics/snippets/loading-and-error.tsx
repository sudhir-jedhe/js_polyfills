// app/dashboard/analytics/loading.tsx
export default function Loading() {
  return <p aria-busy="true">Loading analytics…</p>
}

// app/dashboard/analytics/error.tsx
// Must be a Client Component. Catches render/data errors within this segment.
;('use client')

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div role="alert">
      <h2>Analytics failed to load</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Retry</button>
    </div>
  )
}
