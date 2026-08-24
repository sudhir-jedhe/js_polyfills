# When You'd Still Reach for CSR

It's tempting, once you understand Server Components, to treat client-side rendering as a legacy pattern to avoid. That's wrong — CSR remains the correct choice for a meaningful category of UI, and the App Router doesn't remove it, it just makes it opt-in via `"use client"` rather than the default.

**Genuinely interactive, session-local state.** A drag-and-drop kanban board, a rich text editor, a multi-step form wizard with client-side validation — none of this benefits from server rendering because the "content" *is* the interaction, not the initial HTML. Server-rendering the first frame buys you little when the very next thing that happens is a client-driven state change.

**Data that's inherently per-client and highly volatile.** A live-updating stock ticker polling every second, a chat window with WebSocket messages, real-time collaborative cursors — server-rendering a snapshot of this data is stale before the response even reaches the browser. It makes more sense to render a shell server-side and let a Client Component own the live data subscription.

```tsx
'use client'
import { useEffect, useState } from 'react'

export function StockTicker({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`wss://example.com/stream/${symbol}`)
    ws.onmessage = (e) => setPrice(JSON.parse(e.data).price)
    return () => ws.close()
  }, [symbol])

  return <span>{price ? `$${price.toFixed(2)}` : 'Connecting…'}</span>
}
```

**Content gated behind browser-only APIs.** Geolocation, `localStorage`-driven UI, `window` dimensions, drag events, canvas manipulation — these simply don't exist during server rendering, so the component has to be a Client Component that does its real work after mount.

**Content that's explicitly not SEO-relevant and doesn't need to be crawlable or appear in the initial HTML.** A user's private notification dropdown, an authenticated-only settings panel with no external link pointing to it, an in-app search-as-you-type result list.

**A practical decision heuristic:** ask "does this need to exist in the initial HTML response for SEO, performance (avoiding a loading flash for above-the-fold content), or accessibility reasons — and can it be computed without per-client interactivity?" If yes, prefer Server Component rendering (SSG/ISR/SSR as appropriate). If the honest answer is "this is fundamentally about client interactivity or live client-side state," CSR via a `"use client"` component is correct, not a compromise. Most real pages are a mix: a server-rendered shell (nav, static content, initial data) with small CSR islands for the genuinely interactive or live pieces — which is exactly the composition pattern the App Router is designed to encourage.
