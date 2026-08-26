# Scenario: A Dashboard Making the Same API Call Five Times

Your team's internal analytics dashboard renders a header showing the current org's name and plan, a sidebar showing the org's usage limits, and a main content area with three widgets — all of which independently need the "current organization" object, fetched from an internal billing service. Your APM tooling shows this billing endpoint being hit 5 times per single page load, adding meaningfully to server response time and load on the billing service, which has its own rate limits.

**Approach:** First, confirm this isn't already covered by Request Memoization, since that's the mechanism that's supposed to prevent exactly this. Check that every call site uses an *identical* `fetch()` invocation — same URL, same options object shape (or at minimum, the same after Next.js's internal normalization).

```tsx
// lib/get-org.ts — the shared fetch, used consistently everywhere
export async function getCurrentOrg() {
  const res = await fetch('https://billing.internal.example.com/org/current', {
    headers: { 'x-service': 'dashboard' },
  })
  return res.json()
}
```

If every component (header, sidebar, three widgets) imports and calls this exact function with no variation, Request Memoization should collapse all 5 calls into 1 network request within a single render. If the APM data still shows 5 calls, the most likely culprits are: (1) each component independently constructs its own slightly different fetch options (e.g., one adds an extra header, another passes a cache-busting query param, breaking the identical-call requirement for memoization), or (2) one or more of these "components" is actually a Client Component doing its own client-side `useEffect` fetch against a Route Handler, which is a completely separate request outside the Server Component render pass and Request Memoization's scope entirely — memoization can't help there.

```tsx
// Common cause #1: subtly different call sites defeat memoization
// header — no extra option
const org = await fetch('https://billing.internal.example.com/org/current')
// widget — accidentally adds a cache-busting timestamp, making it a DIFFERENT call
const org2 = await fetch(`https://billing.internal.example.com/org/current?t=${Date.now()}`)
```

The fix is standardizing on one shared `getCurrentOrg()` function (as above) imported everywhere the org data is needed, ensuring identical call signatures, and auditing for any Client Component doing its own redundant client-side fetch of the same data — those should instead receive the org data as a prop from a Server Component ancestor that already fetched it once. After this cleanup, APM should show exactly 1 request to the billing service per page load instead of 5.
