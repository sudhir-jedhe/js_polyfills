# Problem: Generate Open Graph and Twitter Card Tags Programmatically

## Problem Statement

Write a function `renderSocialMetaTags(post)` that takes a blog post object and returns the complete HTML string of Open Graph + Twitter Card `<meta>` tags for it, handling missing optional fields gracefully.

## Requirements

- `post` has: `title` (required), `description` (required), `image` (optional), `url` (required, must be absolute), `siteName` (required), `publishedAt` (optional, a `Date`).
- Always emit `og:title`, `og:description`, `og:url`, `og:site_name`, and `og:type="article"`.
- Emit `og:image` and `twitter:card` (`summary_large_image`) **only if** `image` is provided — a card layout claiming a large image when none exists produces a broken preview, so the tag must be conditional.
- Emit `article:published_time` only if `publishedAt` is provided, formatted as an ISO 8601 string.
- Throw a clear error if `url` is not absolute (doesn't start with `http://` or `https://`) — a relative `og:url` is a silent, hard-to-debug bug in production.
- Escape HTML special characters in all text content to prevent malformed markup if a title/description contains characters like `"` or `&`.

## Approach

Build the tag list incrementally, always pushing the required tags first, then conditionally pushing image/Twitter/published-time tags only when their source data exists. Validate the URL early and throw before generating anything, since a relative URL is a data problem, not a rendering nuance. Centralize HTML-escaping in one helper used for every text value.

## Solution

```js
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderSocialMetaTags(post) {
  const { title, description, image, url, siteName, publishedAt } = post;

  if (!/^https?:\/\//.test(url)) {
    throw new Error(`og:url must be an absolute URL, got: "${url}"`);
  }

  const tags = [
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}">`,
  ];

  if (image) {
    tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  }

  if (publishedAt) {
    tags.push(`<meta property="article:published_time" content="${publishedAt.toISOString()}">`);
  }

  return tags.join('\n');
}

// --- verification ---
console.log(
  renderSocialMetaTags({
    title: 'Why "async" Isn\'t Always Faster',
    description: 'A deep dive into script loading & the async/defer trade-off.',
    image: 'https://example.com/og/async-vs-defer.jpg',
    url: 'https://example.com/blog/async-vs-defer',
    siteName: 'Example Blog',
    publishedAt: new Date('2026-02-01T00:00:00Z'),
  })
);
/*
<meta property="og:type" content="article">
<meta property="og:title" content="Why &quot;async&quot; Isn't Always Faster">
<meta property="og:description" content="A deep dive into script loading & the async/defer trade-off.">
... etc, including og:image, twitter:card, and article:published_time
*/

console.log(
  renderSocialMetaTags({
    title: 'Untitled Draft',
    description: 'No image yet.',
    url: 'https://example.com/blog/untitled-draft',
    siteName: 'Example Blog',
  })
);
// No og:image or twitter:card lines — image was omitted, so those tags are skipped entirely

renderSocialMetaTags({ title: 'x', description: 'y', url: '/relative-path', siteName: 'z' });
// throws: Error: og:url must be an absolute URL, got: "/relative-path"
```

**Why `og:image`/`twitter:card` are conditional rather than always emitted with a fallback placeholder image:** A generic placeholder would produce a technically-valid but misleading preview (a card claiming a large hero image for content that has none) — omitting the tags entirely lets each platform fall back to its own default behavior (usually a plain link with no image) rather than presenting a fabricated-looking preview.

**Why URL validation happens before building any tags, not inline where `og:url` is pushed:** Throwing early, before any partial output is constructed, avoids a caller ever seeing/rendering a half-built tag list — the function should be all-or-nothing for a genuinely invalid input rather than a rendering-time surprise.
