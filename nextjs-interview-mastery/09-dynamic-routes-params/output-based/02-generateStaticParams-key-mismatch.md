# What happens at build time?

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ id: post.slug })); // note the key
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <Post post={post} />;
}
```

**Answer:** The build succeeds with no error or warning, but **zero pages get statically pre-rendered** as intended — Next.js silently ignores the `id` key because it doesn't match the dynamic segment name (`slug`) declared by the folder `[slug]`. Every request to `/blog/anything` falls through to on-demand rendering at request time (assuming `dynamicParams` is left at its default `true`), which works, but defeats the entire purpose of calling `generateStaticParams` — none of the "hot" paths get pre-built HTML shipped at deploy time.

**Why:** `generateStaticParams` must return objects whose keys **exactly** match the dynamic segment names in the route's folder structure — `[slug]` requires a `slug` key, not `id`, `postSlug`, or anything else. There's no compile-time check tying the returned object shape to the folder name (it's just a plain object return), so this is a purely runtime/build-time mismatch that TypeScript won't catch unless you explicitly type the return value against a shared param type. The fix: `return posts.map((post) => ({ slug: post.slug }))`. A good habit is to define `type Params = { slug: string }` once and reference it in both the page's `params` prop type and (loosely) when constructing the `generateStaticParams` return array, as a manual guardrail against typos like this.
