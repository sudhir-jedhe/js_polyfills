# Output: What Happens for a Slug Not in `generateStaticParams`?

```tsx
// app/docs/[slug]/page.tsx
export async function generateStaticParams() {
  return [{ slug: 'getting-started' }, { slug: 'installation' }]
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const doc = await getDoc(params.slug)
  if (!doc) notFound()
  return <article>{doc.content}</article>
}
```

A new doc, `advanced-config`, is added to the CMS after the last build, so it's not in the `generateStaticParams` list. A user visits `/docs/advanced-config` in production. What happens by default?

**Answer:** By default (`dynamicParams` not explicitly set to `false`), Next.js renders the page **on-demand at request time** for this unlisted slug — it runs the page's Server Component render dynamically for that one request, then caches the resulting HTML for subsequent visitors, effectively behaving like ISR for that specific path going forward.

**Why:** `generateStaticParams` only pre-builds the *listed* paths at build time — it isn't an exhaustive allowlist by default. Next.js's `dynamicParams` route config defaults to `true`, meaning any params not returned by `generateStaticParams` are still handled: the framework falls through to rendering them dynamically the first time they're requested, then caches that output so it doesn't have to re-render on every subsequent hit to the same path. If the team wanted unlisted slugs to 404 instead (say, to guarantee only explicitly known docs are ever servable, and to avoid rendering arbitrary/unexpected params), they'd add `export const dynamicParams = false` to the route file — in that case, `/docs/advanced-config` would immediately hit `not-found.tsx` instead of attempting an on-demand render, even if `getDoc('advanced-config')` would have returned valid data.
