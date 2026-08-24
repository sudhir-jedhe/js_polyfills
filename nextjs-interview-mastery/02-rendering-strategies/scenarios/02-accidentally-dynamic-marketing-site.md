# Scenario: A Marketing Site That Should Be Static but Isn't

Your monitoring shows the `/`, `/pricing`, and `/features` marketing pages are hitting your Node server on every single request — response times are 200-400ms and server costs are climbing, even though the content is identical for every visitor and only changes when marketing pushes a copy update. You expected these to be served instantly from a CDN as static HTML.

**Approach:** Something in the shared render path is forcing dynamic rendering. The most common culprits, in order of likelihood, are worth checking directly in the code:

1. **A shared layout or component reads `cookies()` or `headers()` for something that doesn't actually need to be per-request** — e.g., a feature-flag check, an A/B test bucket assignment, or reading a locale cookie inside a Server Component that's part of every marketing page's render tree.

```tsx
// app/(marketing)/layout.tsx — the likely culprit
import { cookies } from 'next/headers'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const abVariant = cookies().get('ab_variant')?.value // forces the WHOLE group dynamic
  return <div data-variant={abVariant}>{children}</div>
}
```

2. **A `fetch()` somewhere in the tree uses `cache: 'no-store'`** unnecessarily, or a route segment has `export const dynamic = 'force-dynamic'` left over from earlier debugging.

The fix depends on what the cookie read is actually for. If it's an A/B test, move that logic to middleware that sets a response header or rewrites to variant-specific static routes, rather than reading cookies inside the Server Component render — middleware runs at the edge before the cached page is served and doesn't force the page itself to be dynamic. If it's a locale preference, prefer routing-based i18n (`/en/pricing`, `/fr/pricing`, each independently static) over a cookie read inside the render.

```tsx
// app/(marketing)/layout.tsx — fixed: no dynamic function, group stays static
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

After removing the dynamic function usage from the shared layout, confirm the fix by running `next build` and checking the build output summary, which explicitly reports each route as either "○ Static" or "λ Dynamic" — that table is the fastest way to catch accidental dynamic opt-outs before they reach production monitoring.
