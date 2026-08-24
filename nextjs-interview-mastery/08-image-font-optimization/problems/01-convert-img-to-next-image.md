# Problem 1: Convert a Raw `<img>` Page and Fix a Layout-Shift Bug

## Task

You're given this page, which has a visible layout-shift bug — the article's
text jumps down noticeably once the cover image finishes loading, especially
on slow connections:

```jsx
// app/blog/[slug]/page.jsx — BROKEN
export default async function ArticlePage({ params }) {
  const post = await getPost(params.slug);

  return (
    <article>
      <img src={post.coverImage} alt={post.title} className="w-full" />
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
```

Convert it to `next/image`, fixing the layout shift, given:

- The cover image's actual dimensions vary per post but are always
  available on the post object as `post.coverWidth`/`post.coverHeight`.
- The image should render responsively at full container width, scaling
  height proportionally.
- This image is the page's LCP element (it's the first thing visible above
  the fold).
- Assume `post.coverImage` is hosted on `https://cdn.example-blog.com`.

## Constraints

- Preserve the responsive full-width behavior.
- Don't hardcode a single fixed pixel size — use the real per-post
  dimensions so the aspect ratio is always correct.

## Solution

```jsx
// app/blog/[slug]/page.jsx — FIXED
import Image from 'next/image';

export default async function ArticlePage({ params }) {
  const post = await getPost(params.slug);

  return (
    <article>
      <Image
        src={post.coverImage}
        alt={post.title}
        width={post.coverWidth}
        height={post.coverHeight}
        priority
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
```

```js
// next.config.js — required for the remote CDN hostname
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example-blog.com', pathname: '/**' },
    ],
  },
};
```

Why this fixes the shift and the LCP: `width`/`height` (the real per-post
values, not a guess) let Next.js compute and reserve the correct aspect
ratio in the DOM immediately, so `style={{ width: '100%', height: 'auto' }}`
scales it responsively without ever showing zero height or the wrong ratio
before the image loads. `priority` removes this LCP-candidate image from
lazy loading and adds a preload hint, so it starts fetching as early as
possible rather than waiting on viewport-intersection logic. `sizes="100vw"`
correctly tells the responsive image system this element spans the full
viewport width at every breakpoint.
