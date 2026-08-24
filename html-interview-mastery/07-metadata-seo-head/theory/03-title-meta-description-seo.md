# `<title>` and Meta Description for SEO

These two elements are what a user actually sees in a search engine results page (SERP) before clicking — they don't directly boost ranking as heavily as content quality/backlinks do, but they're the single biggest lever on **click-through rate**, and `<title>` in particular does carry real ranking weight.

## `<title>`

```html
<title>Buy Running Shoes Online | Free Shipping – ExampleStore</title>
```

- Appears as the clickable blue link text in search results, the browser tab label, and the default bookmark name.
- Search engines typically truncate displayed titles around **50-60 characters** (it's pixel-width-based, not a strict character count, but that's the practical working range) — a longer title still exists in the HTML and is still used for ranking/matching, but gets cut off (often with an ellipsis) in the visible SERP snippet.
- Should be unique per page — every distinct page on a site having the same generic `<title>` (a common bug on poorly-configured SPAs) actively hurts both SEO and usability (identical browser tab labels, identical bookmark names).
- Best practice ordering: most important/specific keywords first, brand name last (as shown above), since the truncation cuts from the end.

## `<meta name="description">`

```html
<meta name="description" content="Shop running shoes for road, trail, and race day. Free shipping on orders over $50 and 30-day returns.">
```

- The gray summary text shown under the title in a SERP — **not** a direct ranking factor for most search engines, but a major factor in whether a user actually clicks through, since it's effectively free ad copy for your page.
- Search engines will **override** it with an auto-extracted snippet from the page content if it's missing, too generic, or judged not to match the searcher's query well — so writing a specific, accurate, compelling description doesn't guarantee it's shown verbatim, but gives the best odds.
- Practical target length: roughly **150-160 characters** before truncation in most SERP layouts (again, pixel-width-based in practice).
- Should be unique per page, just like `<title>` — a single templated description reused across an entire product catalog is a common, easily-fixed SEO mistake.

## Common anti-patterns worth calling out in an interview

- **Keyword stuffing** in either tag (`Shoes Shoes Buy Shoes Running Shoes Cheap Shoes`) — search engines actively penalize this rather than rewarding keyword density, and it reads badly to users too.
- **Duplicate titles/descriptions across many pages** — dilutes each page's distinct identity in search results and can cause search engines to treat near-duplicate pages as lower quality or even consolidate/demote them.
- **Missing `<title>` entirely** — search engines will auto-generate one from page content or the URL, almost always worse than an author-written one.
- **Client-side-only rendered titles** (setting `document.title` via JS in a SPA with no server-side rendering or prerendering) — if the crawler doesn't execute JS (or executes it with limits/timeouts), it may index the page under a generic fallback title rather than the actual per-route title; SPAs need either SSR/prerendering or confirmation that the crawler in question reliably executes JS before relying on this.

## Quick reference

| Element | Shown where | SERP truncation | Direct ranking factor? |
|---|---|---|---|
| `<title>` | Browser tab, SERP headline, bookmarks | ~50-60 chars | Yes, moderately |
| `meta description` | SERP summary text | ~150-160 chars | No (but drives click-through rate) |
