# Scenario: A Dashboard That's 95% Static Metrics, 5% Interactive Filter

Your analytics dashboard shows a grid of metric cards (revenue, signups, churn — all fetched from your data warehouse) plus a single date-range filter dropdown that, when changed, re-fetches and re-renders the metric cards for the new range. The current implementation marks the entire `DashboardPage` as `"use client"` because of the dropdown, and does all data fetching in a `useEffect` on mount and on filter change.

**Approach:** The dropdown is the only genuinely interactive piece — everything else (the metric cards themselves) can be a Server Component if you change *how* the filter change is communicated: instead of client-side `useEffect` refetching, use the URL's `searchParams` as the source of truth for the date range, and let the Server Component page re-render server-side when the URL changes.

```tsx
// app/dashboard/page.tsx — back to a Server Component
import { DateRangeFilter } from './DateRangeFilter'
import { MetricCard } from './MetricCard'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string }
}) {
  const range = { from: searchParams.from ?? '30d-ago', to: searchParams.to ?? 'today' }
  const metrics = await getMetrics(range) // direct server-side fetch, no client round trip

  return (
    <div>
      <DateRangeFilter currentRange={range} />
      <div className="grid">
        {metrics.map((m) => (
          <MetricCard key={m.id} label={m.label} value={m.value} />
        ))}
      </div>
    </div>
  )
}
```

```tsx
// app/dashboard/DateRangeFilter.tsx — the only Client Component
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export function DateRangeFilter({ currentRange }: { currentRange: { from: string; to: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(from: string, to: string) {
    const params = new URLSearchParams(searchParams)
    params.set('from', from)
    params.set('to', to)
    router.push(`/dashboard?${params.toString()}`) // triggers a fresh server render
  }

  return (
    <select onChange={(e) => handleChange(e.target.value, 'today')} defaultValue={currentRange.from}>
      <option value="7d-ago">Last 7 days</option>
      <option value="30d-ago">Last 30 days</option>
      <option value="90d-ago">Last 90 days</option>
    </select>
  )
}
```

`MetricCard` also becomes a plain Server Component since it has no interactivity of its own — it just renders whatever `value`/`label` it's given. Navigating to a new URL via `router.push` re-runs `DashboardPage` on the server with the new `searchParams`, which re-fetches and re-renders the metrics server-side — no client-side data-fetching logic, no `useEffect`, and the heavy metric-rendering logic (potentially involving formatting libraries, chart data transforms) never ships to the browser at all. Only the small `<select>` and its `onChange` handler remain client-side.
