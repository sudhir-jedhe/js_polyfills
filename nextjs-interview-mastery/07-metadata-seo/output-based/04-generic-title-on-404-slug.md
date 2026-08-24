## Why does a nonexistent blog post still show "Loading Post..." as the tab title?

```jsx
// app/blog/[slug]/page.jsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post ? post.title : 'Loading Post...',
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    return <div>Post not found.</div>;
  }
  return <article><h1>{post.title}</h1></article>;
}
```

Visiting `/blog/this-slug-does-not-exist` renders a "Post not found" message
in the body, but the browser tab shows "Loading Post..." — a title that
never made sense to display for a 404 case, and it also returns a `200`
status when it should be a `404`.

**Answer:** Two bugs stacked together. First, `'Loading Post...'` is a leftover
placeholder that makes no sense as the actual fallback title for a missing
post — it should read something like `'Post Not Found'`. Second, and more
importantly, this route never actually returns an HTTP `404` — the page
component just renders a plain `<div>` with 200 status, meaning search
engines index this as a normal, successful page rather than recognizing it
as missing content (which can quietly pollute your index with thousands of
"soft 404" pages if slugs are ever invalid, mistyped, or later deleted).

**Why:** Returning valid-looking metadata plus a 200-status "not found"
message is exactly the "soft 404" anti-pattern search engines specifically
try to detect and penalize. The fix uses Next's `notFound()` function, which
sets a real 404 status and renders the nearest `not-found.jsx`:

```jsx
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Post Not Found', robots: { index: false } };
  }
  return { title: post.title };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }
  return <article><h1>{post.title}</h1></article>;
}
```

Note the metadata is still resolved correctly (a sensible, accurate title,
plus `robots: { index: false }` to explicitly discourage indexing), while
`notFound()` in the page component is what actually produces the correct
`404` HTTP status.
