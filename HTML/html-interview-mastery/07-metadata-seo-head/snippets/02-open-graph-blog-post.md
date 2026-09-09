***  02-open-graph-blog-post.md ***

# Snippet: Open Graph Tags for a Blog Post

```html
<meta property="og:type" content="article">
<meta property="og:title" content="Why Your CSS Bundle Is Too Big">
<meta property="og:description" content="A practical audit of common causes of stylesheet bloat, and how to fix each one.">
<meta property="og:image" content="https://example.com/og/css-bundle-size.jpg">
<meta property="og:url" content="https://example.com/blog/css-bundle-size">
<meta property="og:site_name" content="Example Engineering Blog">
<meta property="article:published_time" content="2026-01-15T09:00:00Z">
<meta property="article:author" content="Ada Lovelace">
```

`og:type="article"` unlocks the `article:*` extension tags (`published_time`, `author`) that some platforms surface in their preview UI. `og:image` is an absolute URL, since scrapers fetch it out of page context and can't resolve a relative path.
