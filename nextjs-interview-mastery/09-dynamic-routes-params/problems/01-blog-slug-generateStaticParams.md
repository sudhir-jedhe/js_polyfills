# Problem 1: Blog route with hybrid pre-rendering

## Task

Implement a `[slug]` blog route at `app/blog/[slug]/page.tsx` that:

1. Uses `generateStaticParams()` to pre-render the **5 most recent** posts at build time.
2. Renders any other (older) post **on-demand** the first time it's requested, and caches it afterward — no 404 for legitimate older posts.
3. Calls `notFound()` for a slug that truly doesn't exist in the data source.
4. Revalidates every rendered post hourly so edits to published posts propagate without a full redeploy.

## Requirements

- Assume a `getPosts({ limit, sort })` and `getPost(slug)` data-access layer exists (mock them however you like — an in-memory array is fine).
- `params` must be typed as a `Promise` (Next.js 15 convention) and awaited before use.
- Explicitly set the config that governs whether unlisted slugs 404 or render on-demand — don't rely on the implicit default without stating it.

## Starter shape

```tsx
// app/blog/[slug]/page.tsx
export const dynamicParams = /* fill in */;
export const revalidate = /* fill in */;

export async function generateStaticParams() {
  // fill in
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // fill in
}
```

## Self-check

- Does hitting a slug outside the pre-rendered 5 return the post instead of a 404?
- Does hitting a genuinely nonexistent slug return a proper 404 (via `notFound()`, not a thrown unhandled error)?
- Would this build succeed with only 5 `fetch`/data calls at build time rather than one per post in your dataset?
