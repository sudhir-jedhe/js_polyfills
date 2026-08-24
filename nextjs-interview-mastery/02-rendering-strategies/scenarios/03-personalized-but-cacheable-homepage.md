# Scenario: A Homepage That's "Personalized" but Mostly the Same for Everyone

Your app's homepage shows a mostly-identical hero section and featured content grid to all visitors, but has one small "Welcome back, {name}" greeting in the top corner for logged-in users, driven by a session cookie. Currently, the entire homepage is marked `force-dynamic` because of that one greeting, meaning every visitor — including the vast majority who are logged out and would see the same content — pays a full server round-trip.

**Approach:** The mistake is letting one small personalized fragment force the entire route into dynamic rendering. The fix is to isolate the cookie-dependent piece into its own component and either render it client-side or wrap it in a `<Suspense>` boundary so the rest of the page can stay static (this composition, more fully supported with Partial Prerendering in newer Next.js versions, is good practice even without PPR enabled).

```tsx
// app/page.tsx — static/ISR again, no dynamic function at this level
import { Suspense } from 'react'
import { PersonalizedGreeting } from './PersonalizedGreeting'

export const revalidate = 3600

export default async function HomePage() {
  const featured = await getFeaturedContent()

  return (
    <div>
      <Suspense fallback={<div className="greeting-placeholder" />}>
        <PersonalizedGreeting />
      </Suspense>
      <Hero />
      <FeaturedGrid items={featured} />
    </div>
  )
}
```

```tsx
// app/PersonalizedGreeting.tsx — isolated dynamic piece
import { cookies } from 'next/headers'

export async function PersonalizedGreeting() {
  const sessionId = cookies().get('session')?.value
  if (!sessionId) return null

  const user = await getUserBySession(sessionId)
  return <p>Welcome back, {user.name}</p>
}
```

Without Partial Prerendering enabled, note that `PersonalizedGreeting` still being a Server Component that calls `cookies()` will, strictly speaking, propagate dynamic-ness to the route in current stable Next.js — the honest production-ready fix in that case is to make `PersonalizedGreeting` a **Client Component** that fetches the session-based greeting from a small Route Handler (`/api/me`) after mount, so the cookie read happens client-side and doesn't touch the Server Component render path at all. Either way, the design principle is the same: keep genuinely personalized fragments as small, isolated, separately-rendered pieces rather than letting them contaminate an otherwise cacheable page — measure what fraction of the page is actually visitor-specific, and don't pay the dynamic-rendering cost for the 95% that isn't.
