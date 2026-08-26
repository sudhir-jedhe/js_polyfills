*** copy 05-robots-meta-noindex-nofollow.md ***

# Snippet: `noindex` a Thank-You Page Without Blocking It in `robots.txt`

```html
<!-- /checkout/thank-you -->
<head>
  <meta name="robots" content="noindex, follow">
</head>
```

```
# robots.txt — NOTE: /checkout/ is intentionally NOT disallowed here
User-agent: *
Disallow: /admin/
```

`noindex` keeps the thank-you page out of search results, while `follow` still lets any links on that page pass crawl signal onward (harmless here, but worth being explicit about). Crucially, `/checkout/` is left crawlable in `robots.txt` — if it were blocked there instead, the crawler would never fetch the page at all, and would never see the `noindex` instruction inside it.
