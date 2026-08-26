## Why is the site name missing from this blog post's share preview?

```jsx
// app/layout.jsx
export const metadata = {
  title: { default: 'Acme Blog', template: '%s | Acme Blog' },
  openGraph: {
    siteName: 'Acme Blog',
    images: ['/default-og.png'],
    locale: 'en_US',
    type: 'website',
  },
};

// app/blog/[slug]/page.jsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}
```

When this blog post is shared on Slack/Twitter, the preview shows the post
title but no image and no site name — even though the root layout clearly
defines both.

**Answer:** The blog post's `openGraph` object entirely replaces the root
layout's `openGraph` object rather than merging with it field by field —
`siteName`, `images`, `locale`, and `type` are all lost because the page's
`generateMetadata()` only specified `title` and `description` inside its own
`openGraph`.

**Why:** Top-level metadata keys (`title`, `description`, `openGraph` itself
as a key) shallow-merge with the parent's values, but *within* `openGraph`,
redefining the object at a deeper segment replaces it wholesale — it isn't
deep-merged. This is one of the most common real-world broken-share-preview
bugs. The fix is to explicitly re-specify every OG field the page still
wants, even the ones that "should" have been inherited:

```js
openGraph: {
  title: post.title,
  description: post.excerpt,
  siteName: 'Acme Blog',
  images: [post.coverImage ?? '/default-og.png'],
  locale: 'en_US',
  type: 'article',
}
```
