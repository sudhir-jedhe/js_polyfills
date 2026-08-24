# Output: Static, ISR, or Dynamic?

```tsx
// app/greeting/page.tsx
import { cookies } from 'next/headers'

export const revalidate = 120

export default async function GreetingPage() {
  const name = cookies().get('name')?.value ?? 'friend'
  return <h1>Hello, {name}</h1>
}
```

The developer set `revalidate = 120` expecting ISR behavior — a cached page regenerated at most every 2 minutes. Does this route actually behave as ISR?

**Answer:** No. This route is fully dynamic (rendered per-request), and the `revalidate = 120` export is effectively ignored/meaningless here — every request re-executes `cookies()` and re-renders from scratch.

**Why:** Calling `cookies()` is a dynamic function — it signals to Next.js that the route needs request-specific data (the incoming request's cookie header), which by definition cannot be known or fixed at build/cache time. Once any dynamic function is used in a route's render path, Next.js opts the *entire route* out of static/ISR caching, regardless of a `revalidate` export being present. The `revalidate` config only has an effect on routes that are otherwise eligible for static generation — it doesn't override or coexist with dynamic function usage. To get the intended ISR behavior, the developer would need to remove the dependency on `cookies()` (e.g., pass `name` via a query param that can be read from `searchParams` combined with static fallback, or split the personalized part into a small Client Component/dynamic segment while keeping the rest of the page static).
