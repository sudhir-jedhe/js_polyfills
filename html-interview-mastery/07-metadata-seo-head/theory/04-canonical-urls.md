# Canonical URLs

The `rel="canonical"` link tells search engines "if you find this content reachable at multiple URLs, treat THIS one as the authoritative version" — it's the primary tool for avoiding duplicate-content SEO problems.

## Basic usage

```html
<link rel="canonical" href="https://example.com/products/running-shoes">
```

## Why duplicate content happens even on a "single" page

A single logical page is very often reachable via several distinct URLs without anyone intending it:

```
https://example.com/products/running-shoes
https://example.com/products/running-shoes?utm_source=newsletter
https://example.com/products/running-shoes?color=red
https://www.example.com/products/running-shoes   (www vs. non-www)
http://example.com/products/running-shoes         (http vs. https)
https://example.com/products/running-shoes/        (trailing slash variant)
```

Without a canonical tag, a search engine may index several of these as separate pages with near-identical content, which can **split ranking signals** (backlinks and relevance pointing at different URLs instead of consolidating onto one) and occasionally trigger duplicate-content quality penalties. `rel="canonical"` consolidates all of these signals onto the one URL declared canonical, regardless of which variant a user or crawler actually arrived at.

## Self-referencing canonicals

Even a page with no known duplicates should typically declare a canonical pointing at **itself**:

```html
<!-- On https://example.com/blog/post-1 -->
<link rel="canonical" href="https://example.com/blog/post-1">
```

This is standard, recommended practice — it's cheap insurance against future duplication (someone later adds tracking parameters, a syndication partner mirrors the content, etc.) and removes any ambiguity for the crawler up front.

## Canonical vs. `noindex` — different tools for different problems

| | `rel="canonical"` | `<meta name="robots" content="noindex">` |
|---|---|---|
| Meaning | "This content is a duplicate/variant of that other URL — consolidate signals there" | "Don't index THIS page in search results at all" |
| Page still crawled? | Yes | Yes (crawled, then excluded from the index) |
| Right for | Filtered/sorted product listing pages, URL parameter variants, syndicated content | Admin pages, thank-you/checkout-confirmation pages, internal search results pages |

Using `noindex` on what's actually a legitimate duplicate (instead of `canonical`) throws away that page's ranking signals entirely rather than consolidating them onto the preferred URL — usually the wrong tool for that specific job.

## Canonical tags must be absolute URLs

```html
<!-- Wrong — relative URL, ambiguous to crawlers parsing this tag out of context -->
<link rel="canonical" href="/products/running-shoes">

<!-- Right -->
<link rel="canonical" href="https://example.com/products/running-shoes">
```

## Cross-domain canonicals

Canonical tags can point to an entirely different domain — commonly used when content is intentionally syndicated to a partner site, telling search engines the original source (not the syndicated copy) should rank:

```html
<!-- On partner-site.com, syndicating content originally published elsewhere -->
<link rel="canonical" href="https://original-source.com/the-original-article">
```
