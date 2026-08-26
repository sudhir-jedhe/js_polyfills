*** copy 01-broken-social-share-preview.md ***

# Scenario: Links to the Site Show a Blank Preview When Shared on Slack/Twitter

**Scenario:** Marketing reports that whenever someone shares a link to a blog post in Slack or on X/Twitter, the preview card shows no image and a generic site-wide description instead of the actual post's title/summary/image. The page itself looks fine in a browser. What's going on, and how do you fix it?

**Diagnosis:** This is almost always a missing-or-generic Open Graph tags problem — social platforms don't render the page or extract content heuristically the way a search engine partially does; they look specifically for `og:title`, `og:description`, `og:image`, etc., and if those tags are absent, they either show nothing useful or fall back to whatever generic tags exist site-wide (e.g., a shared `<meta name="description">` used identically across every page, or no `og:*` tags at all, causing some platforms to guess from the first image/paragraph on the page — inconsistently and often poorly).

**Fix — add per-page Open Graph (and Twitter Card) tags, populated from the actual post content:**

```html
<head>
  <title>Why Your CSS Bundle Is Too Big — Example Blog</title>
  <meta name="description" content="A practical audit of common causes of stylesheet bloat, and how to fix each one.">

  <meta property="og:type" content="article">
  <meta property="og:title" content="Why Your CSS Bundle Is Too Big">
  <meta property="og:description" content="A practical audit of common causes of stylesheet bloat, and how to fix each one.">
  <meta property="og:image" content="https://example.com/og/css-bundle-size.jpg">
  <meta property="og:url" content="https://example.com/blog/css-bundle-size">

  <meta name="twitter:card" content="summary_large_image">
</head>
```

**Why `og:image` needs to be checked specifically:** Even when `og:title`/`og:description` are present, a missing or relative-path `og:image` is the single most common reason previews still look broken (blank thumbnail) — scrapers need an absolute URL and typically require the image be reasonably sized (roughly 1200×630px recommended) and reachable without authentication.

**Verification step to recommend:** After adding the tags, always re-test with an actual scraper/debug tool for each platform (rather than trusting the page source alone), since some platforms **cache** a previously-scraped preview for a URL — a fixed tag set may not show up immediately without forcing a re-scrape, which can otherwise look like "the fix didn't work" when it actually did.
