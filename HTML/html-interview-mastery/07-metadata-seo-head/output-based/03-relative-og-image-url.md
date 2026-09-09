***  03-relative-og-image-url.md ***

# Output: Relative `og:image` URL

```html
<head>
  <meta property="og:title" content="New Product Launch">
  <meta property="og:image" content="/images/launch-hero.jpg">
</head>
```

This page is hosted at `https://example.com/products/new-launch`.

**Question:** When this URL is shared on a social platform, does the preview image show correctly?

**Answer:** Likely not — many scrapers will fail to resolve `/images/launch-hero.jpg` into a working image, and the preview card shows no image (or a broken one) instead of `https://example.com/images/launch-hero.jpg`.

**Why:** Open Graph scrapers fetch and parse `<meta>` tags out of full page context — some naively treat the `content` value as a literal URL rather than resolving it relative to the page's own address the way a browser resolves a relative `<img src>`. Even scrapers that do attempt relative resolution introduce an extra point of failure that a plain absolute URL avoids entirely. The Open Graph spec itself calls for `og:image` (and `og:url`) to be **absolute URLs**; the practical fix here is `content="https://example.com/images/launch-hero.jpg"`.
