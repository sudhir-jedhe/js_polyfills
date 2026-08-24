# Scenario: A Product Manager Asks You to Spec Three New Pages

Your PM hands you three new features to plan technically before sprint kickoff: (1) a public "Help Center" with searchable articles, (2) an internal "Team Activity Feed" showing real-time actions teammates take (assigns, comments, status changes), and (3) a per-user "Billing History" page showing past invoices. You need to recommend a rendering strategy for each and justify it in the technical spec.

**Approach:** Run each through the same questions: who's the audience, how often does the content change, and does it need to reflect the exact current request state?

**Help Center.** Same content for every visitor, written by a support team and edited infrequently (maybe a few times a week). SEO matters — you want these articles to rank in search results. → **ISR** with a moderate revalidate window (e.g., 1 hour) as the baseline, plus on-demand `revalidateTag('help-articles')` wired to the CMS's publish webhook so an urgent doc fix (e.g., correcting wrong instructions) can go live immediately rather than waiting out the window.

```tsx
// app/help/[slug]/page.tsx
export const revalidate = 3600
export default async function HelpArticle({ params }: { params: { slug: string } }) {
  const article = await fetch(`https://cms.example.com/help/${params.slug}`, {
    next: { tags: ['help-articles'] },
  }).then((r) => r.json())
  return <Article content={article} />
}
```

**Team Activity Feed.** Inherently live, per-team, and needs to reflect events that can happen seconds apart — a cached or even per-request server render would already be stale by the time it reaches the browser. → **CSR** for the feed itself: server-render a static/ISR shell (page title, filters UI) and have a Client Component subscribe to updates (WebSocket, SSE, or short-interval polling against a Route Handler) for the actual feed content.

```tsx
'use client'
export function ActivityFeed({ teamId }: { teamId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  useEffect(() => {
    const es = new EventSource(`/api/teams/${teamId}/activity-stream`)
    es.onmessage = (e) => setEvents((prev) => [JSON.parse(e.data), ...prev])
    return () => es.close()
  }, [teamId])
  return <ul>{events.map((e) => <li key={e.id}>{e.text}</li>)}</ul>
}
```

**Billing History.** Strictly per-user, sensitive (must never leak across users or be cached publicly), and correctness matters more than raw speed — an out-of-date invoice list is a real problem, not just a minor staleness issue. → **SSR** (forced dynamic), reading the user's session via `cookies()` and fetching their invoices fresh on every request. No caching layer should sit in front of this data.

```tsx
// app/billing/history/page.tsx
import { cookies } from 'next/headers'
export default async function BillingHistoryPage() {
  const session = cookies().get('session')?.value
  const invoices = await fetch(`https://api.example.com/billing/invoices`, {
    headers: { Authorization: `Bearer ${session}` },
    cache: 'no-store',
  }).then((r) => r.json())
  return <InvoiceTable invoices={invoices} />
}
```

The spec's overall framing to give the PM: static-ish strategies (SSG/ISR) for shared, infrequently-changing, SEO-relevant content; SSR for correctness-critical per-user data; CSR for genuinely live/interactive pieces — and most real pages, like the Help Center's shell plus a client-side search box, end up combining more than one of these rather than picking just one.
