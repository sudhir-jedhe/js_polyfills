# `generateStaticParams()` and `dynamicParams`

`generateStaticParams` is the App Router's replacement for `getStaticPaths` — it tells Next.js which values of a dynamic segment to pre-render into static HTML at build time. It's the mechanism that lets a route like `/blog/[slug]` be both dynamic (infinitely many possible slugs) and statically fast (the popular ones are pre-built).

## The basic contract

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getRecentPosts(5); // e.g. 5 most recent
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <Post post={post} />;
}
```

`generateStaticParams` runs at build time (and during `next build`'s incremental step for on-demand revalidation), not per-request. It returns an array of objects whose keys match the dynamic segment names in the route. For nested dynamic segments (`/blog/[category]/[slug]`), each returned object needs both keys, and you can either generate the full cross-product yourself or export `generateStaticParams` from each nested layer, which Next.js composes automatically.

## `dynamicParams`: what happens for params NOT in the list

This is the part interviewers probe hardest, because it's a config flag with real production consequences:

```tsx
export const dynamicParams = true; // default
```

- **`dynamicParams = true` (default):** a request for a slug *not* returned by `generateStaticParams` is rendered **on-demand** at request time (SSR-like behavior), and the result is cached for subsequent requests — this is the standard "hybrid" pattern: pre-render the hot paths, render the long tail on first visit.
- **`dynamicParams = false`:** a request for a slug not in the pre-rendered list immediately returns a **404**, even if a post with that slug genuinely exists in your data source. This is the right choice when you want a hard guarantee that only an explicit allowlist of pages is ever servable — useful for finite, fully-known route sets (e.g., a fixed set of marketing landing pages) where an unexpected param almost certainly means a bad link or bot traffic, not a legitimate new page.

## Practical pattern: pre-render recent, render the rest on demand

```tsx
export const dynamicParams = true;

export async function generateStaticParams() {
  const recentPosts = await getPosts({ limit: 5, sort: 'newest' });
  return recentPosts.map((p) => ({ slug: p.slug }));
}
```

The first request to an older post's slug is a cache miss — Next.js renders it on the server, serves it, and caches the HTML for the next visitor exactly as if it had been in the original `generateStaticParams` list. This means "static vs. dynamic" isn't a permanent bucket per route — it's per-path-value, and the boundary moves lazily as traffic arrives.

## Interaction with `revalidate`

`generateStaticParams` controls *which* paths get built; `export const revalidate = 3600` (or the `fetch` cache options inside the page) controls *how often* a built path is regenerated. The two are independent knobs — you can pre-render 5 posts and revalidate them hourly while everything outside that list is generated fresh (and cached) on first hit.
