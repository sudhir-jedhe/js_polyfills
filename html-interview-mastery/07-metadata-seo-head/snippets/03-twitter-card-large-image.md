# Snippet: Twitter Card (Large Image) Alongside Open Graph

```html
<!-- Open Graph — used as the fallback source for most Twitter Card fields too -->
<meta property="og:title" content="Why Your CSS Bundle Is Too Big">
<meta property="og:description" content="A practical audit of common causes of stylesheet bloat.">
<meta property="og:image" content="https://example.com/og/css-bundle-size.jpg">

<!-- Just enough Twitter-specific markup to opt into the large-image card layout -->
<meta name="twitter:card" content="summary_large_image">
```

Note the attribute switch: Open Graph tags use `property="og:..."`, Twitter Card tags use `name="twitter:..."`. Since Twitter falls back to `og:title`/`og:description`/`og:image` when the `twitter:*` equivalents are absent, this minimal combination is enough to get the full large-image card without duplicating every field.
