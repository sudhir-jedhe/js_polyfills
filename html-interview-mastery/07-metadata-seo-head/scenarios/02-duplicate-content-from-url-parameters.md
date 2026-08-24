# Scenario: Search Rankings Dropped After Adding Filter/Sort URL Parameters

**Scenario:** An e-commerce category page (`/shoes`) used to rank well. After adding client-side filtering and sorting via URL parameters (`/shoes?color=red`, `/shoes?sort=price-asc`, `/shoes?color=red&sort=price-asc`, etc.), organic search traffic to the category gradually declined over the following months, even though the core `/shoes` content didn't change. What likely happened, and how do you fix it?

**Diagnosis:** Each parameter combination is a distinct, crawlable URL serving near-identical content (the same product grid, just filtered/reordered) — search engines discovered and began indexing many of these variants as if they were separate pages. This **splits ranking signal** (backlinks and relevance that used to concentrate on the single `/shoes` URL now spread thin across dozens of parameter variants) and can trigger duplicate-content quality signals, both of which plausibly explain a gradual ranking decline with no actual content change.

**Fix — add a self-referencing-to-base canonical on every parameterized variant:**

```html
<!-- Served identically at /shoes, /shoes?color=red, /shoes?sort=price-asc, etc. -->
<head>
  <link rel="canonical" href="https://example.com/shoes">
</head>
```

Every variant declares the same canonical target — the plain, unparameterized `/shoes` URL — telling search engines to consolidate all ranking signal there, regardless of which specific filtered/sorted URL was actually crawled.

**Why not just block the parameterized URLs in `robots.txt` instead?** That would prevent crawling entirely, meaning any legitimate value those pages might have (e.g., a `?color=red` URL that happens to attract its own backlinks or serves a genuinely distinct enough audience) is discarded rather than consolidated. `rel="canonical"` is the more precise tool specifically because these are *duplicates of the same core content*, not content that should never be seen by a crawler at all — consolidation, not exclusion, is the correct fix.

**Secondary consideration — internal linking:** If internal navigation (category filter links, sort dropdowns) generates and links to many parameterized URLs, it's worth also checking whether those links pass `rel="nofollow"` or are implemented as JS-only interactions (not actual `<a href>` crawlable links) where appropriate, reducing how many parameter combinations get discovered and crawled in the first place — canonicalization fixes the *indexing* consolidation, but doesn't reduce unnecessary crawl volume on its own.
