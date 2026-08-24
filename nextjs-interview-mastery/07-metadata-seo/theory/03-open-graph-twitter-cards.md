# Open Graph and Twitter Card Metadata

When a link to your page gets pasted into Slack, iMessage, Twitter/X, or
LinkedIn, the preview card those platforms render — image, title,
description — is built entirely from **Open Graph** (`og:*`) meta tags, and
Twitter/X additionally looks for its own `twitter:*` tags before falling back
to Open Graph. Getting these right is often the single highest-leverage SEO
task on a marketing or content site, since a broken or missing preview
measurably hurts click-through rate on shared links.

In the Metadata API, both are plain nested objects on the `metadata` export
or `generateMetadata()` return value:

```jsx
export const metadata = {
  title: 'Next.js Interview Mastery',
  description: 'A hands-on guide to Next.js App Router concepts.',
  openGraph: {
    title: 'Next.js Interview Mastery',
    description: 'A hands-on guide to Next.js App Router concepts.',
    url: 'https://example.com',
    siteName: 'Next.js Interview Mastery',
    images: [
      {
        url: 'https://example.com/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Next.js Interview Mastery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Interview Mastery',
    description: 'A hands-on guide to Next.js App Router concepts.',
    images: ['https://example.com/og-default.png'],
  },
};
```

A few details that matter in practice, not just in the docs:

**OG images should be absolute URLs**, not relative paths, in most cases —
some crawlers (notably many that don't execute JavaScript and don't resolve
relative URLs against a `<base>` tag reliably) fail silently on a relative
`images` path. Setting `metadataBase` in the root layout's metadata lets you
use relative paths everywhere else and have Next.js resolve them to absolute
URLs automatically:

```jsx
// app/layout.jsx
export const metadata = {
  metadataBase: new URL('https://example.com'),
  // now `images: ['/og-default.png']` elsewhere resolves correctly
};
```

**Per-page dynamic OG images** — a blog post wanting its own cover image
rather than the site default — just override `openGraph.images` in that
page's `generateMetadata()`. Remember the "full replace, not merge" rule from
the inheritance theory file: overriding `openGraph` at a page level means
re-specifying every OG field you still want, not just the one you're
changing.

**`twitter.card: 'summary_large_image'`** is almost always what you want for
content-heavy pages (a big preview image); `'summary'` produces a small
thumbnail-style card, appropriate mainly when there's no meaningful image to
show. If you omit the `twitter` object entirely, X/Twitter falls back to
interpreting the `openGraph` tags directly, which is usually good enough for
simple sites but doesn't give you Twitter-specific control (like a different
handle via `twitter.site`/`twitter.creator`).

**Testing matters more than memorizing the schema.** Social platforms cache
preview data aggressively per-URL, so after fixing broken OG tags, you
typically need to force a re-scrape via each platform's own debugging tool
(Facebook's Sharing Debugger, X's Card Validator, LinkedIn's Post Inspector)
rather than assuming the fix is live immediately — a detail worth mentioning
when discussing how you'd actually verify a fix in production.
