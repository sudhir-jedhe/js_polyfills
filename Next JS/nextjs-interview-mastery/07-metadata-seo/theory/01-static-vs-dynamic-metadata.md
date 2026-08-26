# Static `metadata` vs. `generateMetadata()`

The App Router replaces the old `next/head` component approach with a
declarative Metadata API: any `layout.js` or `page.js` file can export either
a static `metadata` object or an async `generateMetadata()` function, and
Next.js injects the resulting `<title>`, `<meta>`, and `<link>` tags into the
document `<head>` during server rendering — before any HTML reaches the
client.

**Static metadata** is the right choice whenever the values don't depend on
anything fetched at request time — an about page, a pricing page, the root
layout's site-wide defaults:

```jsx
// app/about/page.jsx
export const metadata = {
  title: 'About Us',
  description: 'Learn about our mission and team.',
};

export default function AboutPage() {
  return <div>...</div>;
}
```

This is just a plain object, evaluated once, and Next.js can use it during
static generation without running any additional code per request.

**`generateMetadata()`** is required whenever the title/description depend on
data you have to fetch — most commonly a dynamic route like a blog post or
product page, where the `<title>` should be the actual post title, not a
generic placeholder:

```jsx
// app/blog/[slug]/page.jsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  return <article>{/* ... */}</article>;
}
```

A subtlety worth internalizing: `generateMetadata()` and the page component
often need the *same* data (here, `getPost(params.slug)` runs in both). This
looks wasteful — two fetches for the same post — but Next.js automatically
**deduplicates identical `fetch()` calls** made during the same render pass
(request memoization), so as long as you're using `fetch` (or wrap a
non-fetch data source with React's `cache()` function), the second call
resolves from an in-memory cache for that render rather than hitting the
network/database twice. This is why the idiomatic pattern is to *not*
prematurely "optimize" by trying to pass fetched data from `generateMetadata`
into the page component — just call the same data-fetching function in both
places and let deduplication handle it.

`generateMetadata()` also receives a second argument, `{ params, searchParams }`
just like the page component, and can accept a `parent` parameter (a promise
resolving to the parent segment's already-resolved metadata) for cases where
you need to read or extend inherited values rather than fully overriding
them — covered in the next theory file on inheritance and merging.

One more detail interviewers ask about: **metadata resolution blocks
streaming of the `<head>`**, meaning if `generateMetadata()` is slow, Next.js
will wait for it before starting to stream the page — this is a deliberate
tradeoff (correct `<title>`/OG tags matter enough for SEO/sharing to justify
the wait) that's worth being aware of when a dynamic page feels slower to
start than its actual content generation would suggest.
