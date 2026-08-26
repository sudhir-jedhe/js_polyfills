*** copy 02-open-graph-twitter-cards.md ***

# Open Graph and Twitter Card Meta Tags

When a URL is shared on social platforms (Facebook, LinkedIn, Slack, Discord, X/Twitter, etc.), the platform doesn't render your page — it scrapes a specific set of `<meta>` tags to build a preview card (title, description, image, site name). Without these tags, shared links show a bare URL or a poor auto-guessed preview.

## Open Graph (used by Facebook, LinkedIn, Slack, Discord, and most others)

```html
<meta property="og:title" content="10 Tips for Faster Websites">
<meta property="og:description" content="Practical, battle-tested techniques for shaving seconds off load time.">
<meta property="og:image" content="https://example.com/og/faster-websites.jpg">
<meta property="og:url" content="https://example.com/blog/faster-websites">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Example Blog">
```

| Tag | Purpose | Notes |
|---|---|---|
| `og:title` | The headline shown in the preview card | Can differ from `<title>` if you want a punchier social-specific version |
| `og:description` | Short summary shown under the title | Typically ~2-4 sentences, truncated by most platforms |
| `og:image` | The preview thumbnail | **Must be an absolute URL** (not relative) — crawlers resolve it standalone, without page context; recommended minimum ~1200×630px for crisp rendering across platforms |
| `og:url` | Canonical URL for the shared content | Prevents duplicate/inconsistent previews if the same content is reachable at multiple URLs |
| `og:type` | Content type (`website`, `article`, `video.movie`, `product`, etc.) | Some platforms use this to enable type-specific fields (e.g., `article:published_time`) |
| `og:site_name` | The overall site's name | Shown as a small label near the preview, distinct from the specific page's title |

## Twitter Cards (used by X/Twitter specifically)

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="10 Tips for Faster Websites">
<meta name="twitter:description" content="Practical, battle-tested techniques for shaving seconds off load time.">
<meta name="twitter:image" content="https://example.com/og/faster-websites.jpg">
```

- `twitter:card` controls the layout: `summary` (small square thumbnail) vs. `summary_large_image` (full-width image, generally preferred for content with a strong visual).
- If Twitter-specific tags are omitted, X/Twitter **falls back to the equivalent Open Graph tags** in most cases — so a minimal, safe setup is: full Open Graph tags plus just `twitter:card` to opt into the large-image layout, without duplicating title/description/image separately.

## Note the attribute difference: `property` vs. `name`

Open Graph tags use `property="og:..."` (a convention from the RDFa spec Open Graph is built on), while Twitter Card tags use the standard `name="twitter:..."`. This is a common small but real syntax trap — writing `name="og:title"` instead of `property="og:title"` is technically invalid per the Open Graph spec, though many scrapers tolerate it in practice; write it correctly regardless.

## Testing

Both ecosystems provide (or provided) debugging tools to preview how a URL's tags render as a card — worth mentioning that these tags should always be validated against an actual scraper/preview tool, since a typo (e.g., a relative `og:image` URL) silently produces a broken or missing preview with no error visible on the page itself.
