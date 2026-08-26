# Problem 1: Prove Request Memoization Prevents a Duplicate Network Call

## Task

Build a page with two separate Server Components that both fetch the same URL (identical options). Add instrumentation (a `console.log` or a counter) to prove, for a single request, the network call only happens once — then explain what would break the deduplication if you changed one call site's options.

## Solution

```tsx
// lib/get-site-config.ts
let callCount = 0 // module-level counter, for demonstration only

export async function getSiteConfig() {
  callCount++
  console.log(`getSiteConfig actual fetch attempt #${callCount}`)
  const res = await fetch('https://api.example.com/site-config')
  return res.json()
}
```

```tsx
// app/page.tsx
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

export default async function HomePage() {
  return (
    <div>
      <SiteHeader />
      <main>Welcome</main>
      <SiteFooter />
    </div>
  )
}
```

```tsx
// app/SiteHeader.tsx
import { getSiteConfig } from '@/lib/get-site-config'

export async function SiteHeader() {
  const config = await getSiteConfig() // call site #1
  return <header>{config.siteName}</header>
}
```

```tsx
// app/SiteFooter.tsx
import { getSiteConfig } from '@/lib/get-site-config'

export async function SiteFooter() {
  const config = await getSiteConfig() // call site #2, identical fetch
  return <footer>© {config.siteName}</footer>
}
```

**Proof:** For a single request to `/`, the server logs `getSiteConfig actual fetch attempt #1` exactly once, even though `getSiteConfig()` is called from both `SiteHeader` and `SiteFooter`. Only the first call actually executes the `fetch()`; the second reuses the same in-flight/resolved result via React's Request Memoization, since both calls have an identical URL and options within the same render pass.

**What breaks deduplication:** If either call site's `fetch()` used different options — e.g., `SiteFooter` added a cache-busting query param, a different header, or `cache: 'no-store'` while `SiteHeader` didn't — the two calls would no longer be considered identical, and memoization would not apply. Each would trigger its own network request, and the counter would show `#1` and `#2`. Memoization requires the fetch signature (URL + options) to match exactly; it isn't based on "this looks like the same logical data" — it's a literal request-shape comparison.
