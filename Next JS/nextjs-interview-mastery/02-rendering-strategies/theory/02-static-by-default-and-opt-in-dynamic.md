# Static by Default, Dynamic by Opt-In

The single most important mental model for App Router rendering: **Next.js tries to statically render every route at build time by default**, and only falls back to per-request dynamic rendering when it detects something in that route that genuinely requires request-time information. This is a meaningful reversal from how many developers assume Next.js behaves — there's no `getStaticProps` you must remember to write; static is the default outcome unless something forces otherwise.

The things that force a route into **dynamic rendering** (rendered per-request, like SSR):

1. **Dynamic functions** — calling `cookies()` or `headers()` from `next/headers`, or using `searchParams` in a Server Component, all signal "this needs request-specific data," so Next.js opts the whole route out of static generation automatically.
2. **Uncached data requests** — using `fetch(url, { cache: 'no-store' })`, or setting `export const dynamic = 'force-dynamic'` at the route segment level, explicitly disables static optimization for that route.
3. **Dynamic segment configuration** — the route segment config options `export const dynamic`, `export const revalidate = 0`, and `export const fetchCache` can each force dynamic behavior explicitly.

```tsx
// app/dashboard/page.tsx — forced dynamic via a dynamic function
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const theme = cookies().get('theme')?.value ?? 'light'
  return <Dashboard theme={theme} />
}
```

```tsx
// app/status/page.tsx — forced dynamic via explicit config
export const dynamic = 'force-dynamic'

export default async function StatusPage() {
  const status = await getLiveSystemStatus()
  return <StatusBanner status={status} />
}
```

Conversely, a route stays **static** (SSG, or ISR if `revalidate` is set) when every Server Component in it only does things compatible with build-time execution — plain `fetch()` calls with the default caching behavior, no `cookies()`/`headers()`, no `force-dynamic`.

```tsx
// app/about/page.tsx — statically generated, no opt-outs present
export default async function AboutPage() {
  const content = await getAboutContent() // fetch() default = cache: 'force-cache'
  return <article>{content}</article>
}
```

A subtlety worth internalizing: this decision is made **per route segment**, and it's somewhat "infectious" upward — if any component rendered as part of a route's server render tree uses a dynamic function, the *entire route* becomes dynamic, not just that one component. You can't have "half a page" statically generated and "half" dynamically rendered within a single request/response cycle at the route level (though you *can* combine static shells with dynamic islands using `<Suspense>` and Partial Prerendering in newer Next.js versions, which streams the dynamic parts in separately).

Practically, this means during code review you should treat any `cookies()`, `headers()`, `searchParams` usage, or `no-store`/`force-dynamic` config as a flag to explicitly ask: "do we actually need this route to be dynamic, or did this creep in accidentally and silently kill our static optimization for the whole page?"
