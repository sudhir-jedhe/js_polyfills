*** copy 05-robots-meta-vs-robots-txt.md ***

# Robots Meta Tag vs. `robots.txt`

Both control search engine crawler behavior, but they operate at fundamentally different levels — this distinction (and the "noindex needs crawling" trap it implies) is a frequent interview question.

## `robots.txt` — site-level, crawl-level control

A single plain-text file at the site root (`https://example.com/robots.txt`) telling crawlers which **paths** they may or may not **crawl** (fetch) at all:

```
User-agent: *
Disallow: /admin/
Disallow: /cart/
Allow: /

Sitemap: https://example.com/sitemap.xml
```

- Applies to entire path patterns, site-wide, before any individual page is even fetched.
- Purely a **crawling** directive, not an indexing one — a well-behaved crawler won't fetch a `Disallow`'d path at all, but nothing stops a URL from still appearing in search results (typically with no snippet, just the bare URL) if the search engine learns about it some other way (e.g., an external link pointing to it), since it was never able to see a `noindex` instruction it never got to read.
- Not a security mechanism — it's a voluntary convention, and disallowed paths are still publicly listed in a world-readable file, so `robots.txt` should never be relied on to actually hide sensitive URLs.

## `<meta name="robots">` — page-level, indexing-level control

```html
<meta name="robots" content="noindex, nofollow">
```

| Directive | Meaning |
|---|---|
| `index` / `noindex` | Whether this page may appear in search results at all |
| `follow` / `nofollow` | Whether links found on this page should be crawled/pass ranking signal |
| `noarchive` | Don't show a cached-copy link in search results |
| `nosnippet` | Don't show a text preview/snippet in search results |

- Applies per-page, and requires the crawler to actually **fetch the page** to read the `<meta>` tag in the first place — this is the crucial ordering dependency.

## The classic trap: `robots.txt` blocking a page that also has `noindex`

```
# robots.txt
Disallow: /old-promo/
```
```html
<!-- /old-promo/index.html -->
<meta name="robots" content="noindex">
```

**This doesn't work as intended.** Because `robots.txt` prevents the crawler from ever fetching `/old-promo/` in the first place, it never sees the `noindex` meta tag inside it — the two instructions conflict, and the crawl-blocking instruction wins by simply making the page-level instruction unreachable. If the page is already indexed from before the `Disallow` was added, blocking it in `robots.txt` can actually **prevent** it from ever being deindexed, since the crawler can no longer revisit it to notice the `noindex` tag.

**Correct approach to deindex a page:** Use `noindex` **without** blocking it in `robots.txt`, and leave it crawlable until the search engine has revisited and processed the `noindex` directive — only add a `robots.txt` block afterward (if desired, for other reasons like conserving crawl budget), once you've confirmed it's been deindexed.

## Quick decision guide

- Want a crawler to never fetch a whole section of the site (crawl budget, staging areas, infinite filter-parameter combinations)? → `robots.txt`.
- Want a specific page fetched but excluded from search results (a thank-you page, an internal search results page, a duplicate you can't canonicalize)? → `<meta name="robots" content="noindex">`, and make sure it's **not** also blocked in `robots.txt`.
- Want both crawling blocked AND indexing prevented for a page that's never been indexed before? → `robots.txt` alone is typically sufficient, since it was never indexed to begin with.
