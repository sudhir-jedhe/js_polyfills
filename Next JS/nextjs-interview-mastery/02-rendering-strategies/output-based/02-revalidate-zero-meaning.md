# Output: What Does `revalidate = 0` Actually Do?

```tsx
// app/inventory/page.tsx
export const revalidate = 0

export default async function InventoryPage() {
  const items = await fetch('https://api.example.com/inventory').then((r) => r.json())
  return <InventoryTable items={items} />
}
```

A developer sets `revalidate = 0`, reasoning: "0 seconds means regenerate instantly on every request, so this is basically ISR with the shortest possible interval." Is that correct?

**Answer:** No. `revalidate = 0` does not mean "a very fast ISR interval" — it means the route is **fully opted out of static caching and rendered dynamically on every request**, equivalent in effect to `export const dynamic = 'force-dynamic'`.

**Why:** `revalidate` values are meaningful as durations *within the static/ISR caching model* (e.g., `revalidate = 60` means "keep serving the cached version for up to 60 seconds before regenerating in the background"). Zero isn't a valid duration in that model — there's no cache to hold for zero seconds — so Next.js treats it as a signal to bypass static generation and caching altogether for that route, functionally identical to explicit `force-dynamic`. This is a common interview trick: conceptually a smaller number should mean "fresher, but still cached briefly," but at the boundary value it flips into a categorically different rendering mode (no caching at all) rather than an infinitesimally short cache window. If genuinely fast revalidation was the goal (say, "regenerate at most every 5 seconds, but still serve cached content between requests"), the correct value would be `revalidate = 5`, not `0`.
