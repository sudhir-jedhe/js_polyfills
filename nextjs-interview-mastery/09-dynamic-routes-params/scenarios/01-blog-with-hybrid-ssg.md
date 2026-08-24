# Scenario: A blog with hundreds of posts, most read once and never again

**Problem:** Marketing wants every blog post URL to be fast (no visible loading spinner), but the blog has 600+ posts going back years. Building all 600 pages on every deploy is wasteful — most old posts get single-digit monthly views, while the 5 newest posts drive most of the traffic and get shared on social media right after publishing (where speed matters most, since link previews and first click happen within minutes of the deploy).

**Approach:** Use `generateStaticParams` to pre-render only the 5 most recent posts at build time, and leave `dynamicParams` at its default `true` so any other slug renders on-demand on first request and is cached afterward (ISR-style, driven by `revalidate`). This gives fast, pre-built HTML for the traffic-heavy recent posts immediately at deploy time, while the long tail of old posts costs nothing at build time and still ends up cached and fast after their first (slightly slower) request.

```tsx
// app/blog/[slug]/page.tsx
export const dynamicParams = true;

export async function generateStaticParams() {
  const recent = await getPosts({ limit: 5, sort: 'newest' });
  return recent.map((post) => ({ slug: post.slug }));
}

export const revalidate = 3600; // re-check freshness hourly, even for pre-rendered posts

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <PostView post={post} />;
}
```

A secondary consideration worth raising in an interview: if a post is edited after publishing, `revalidate: 3600` means both pre-rendered and on-demand-rendered paths pick up the change within an hour without a redeploy — the static/dynamic split only affects *when the first render happens*, not the ongoing caching/freshness story, which is governed uniformly by `revalidate`.
