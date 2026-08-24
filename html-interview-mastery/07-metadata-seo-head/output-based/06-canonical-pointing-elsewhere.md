# Output: A Page Canonicalized to a Different URL

```html
<!-- Served at: https://example.com/products/shoes?ref=summer-sale -->
<head>
  <link rel="canonical" href="https://example.com/products/shoes">
</head>
```

**Question:** If someone searches for terms specific to this page, is the `?ref=summer-sale` URL likely to appear directly in search results?

**Answer:** No — search engines will generally show the canonical URL (`https://example.com/products/shoes`) in results, even though the actual crawled/discovered URL was the one with the query parameter.

**Why:** `rel="canonical"` is exactly this kind of instruction: "whatever URL you found this content at, treat the specified URL as the authoritative one for indexing and display purposes." Any ranking signal, backlink credit, or search-result URL display gets consolidated onto the canonical target, not the URL the content happened to be crawled from — which is the entire mechanism's purpose: preventing `?ref=summer-sale`, `?ref=email-campaign`, and any other tracking-parameter variant of the same page from being treated as separate, competing pages.
