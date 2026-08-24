## Why is a newly published blog post missing from `sitemap.xml` for hours?

```js
// app/sitemap.js
export default async function sitemap() {
  const posts = await getAllPosts(); // fetch(...) with no cache options specified

  return posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));
}

async function getAllPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}
```

A post is published, and it correctly appears on `/blog` immediately, but a
fresh crawl of `/sitemap.xml` doesn't include it until much later.

**Answer:** `sitemap.js`'s underlying `fetch` call is subject to the same
default caching behavior as any other `fetch` in a Server Component or route
convention — a plain `fetch()` with no explicit cache option defaults to
`force-cache` in Next.js's Data Cache, meaning the sitemap route can keep
serving a stale, previously-cached list of posts until that cache entry is
invalidated or expires, even though `/blog` itself (fetching posts
differently, or already revalidated via a different path/tag) shows the new
post correctly.

**Why:** Every fetch call in Next.js's App Router is independently
cacheable, and `sitemap.js` is not special-cased to bypass that — it's just
another server-side function making a fetch call. The fix is to make the
sitemap's data fetch explicitly fresh or tag-revalidated, matching how often
new content actually needs to be reflected:

```js
async function getAllPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 300 }, // re-fetch at most every 5 minutes
    // or: { cache: 'no-store' } for always-fresh, at the cost of a fetch on every crawl
  });
  return res.json();
}
```

Better still, call `revalidateTag('posts')` from wherever posts get
published/updated (a Server Action or webhook handler), and tag this fetch
with `next: { tags: ['posts'] }`, so the sitemap updates immediately on
publish rather than waiting out a fixed time window.
