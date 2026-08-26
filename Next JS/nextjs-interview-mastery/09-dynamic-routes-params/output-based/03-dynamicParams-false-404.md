# A user reports a broken link. What's happening?

```tsx
// app/blog/[slug]/page.tsx
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts({ limit: 5, sort: 'newest' });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug); // this WOULD successfully find the post
  return <Post post={post} />;
}
```

A marketing email links to a blog post published 8 months ago. Clicking it shows a 404 page. The post is definitely still in the database and `getPost(slug)` would return it fine if the function body ever ran.

**Answer:** The 404 happens **before** `getPost(slug)` is ever called. `dynamicParams = false` tells Next.js to treat `generateStaticParams`'s return value as the *complete, closed* set of valid values for this segment — any slug not in that list is rejected with a 404 at the routing layer, without ever invoking the page component's body.

**Why:** `generateStaticParams` here only returns the 5 most recent posts. With `dynamicParams` left at its default `true`, an 8-month-old post's slug would fall through to on-demand server rendering and succeed. But `dynamicParams = false` turns the pre-rendered list into an allowlist — Next.js short-circuits before rendering. This is exactly the right behavior for routes where you genuinely want a fixed, finite set of pages (e.g., a handful of static campaign pages), but it's a footgun when misapplied to open-ended content like a blog, where new/old posts are legitimately supposed to be reachable beyond the pre-rendered subset. The fix is simply removing `dynamicParams = false` (or setting it to `true`) so posts outside the initial 5 render on-demand and get cached after their first hit.
