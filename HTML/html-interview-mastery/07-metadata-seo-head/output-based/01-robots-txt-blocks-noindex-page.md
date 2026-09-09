***  01-robots-txt-blocks-noindex-page.md ***

# Output: Does This Page Get Deindexed?

```
# robots.txt
User-agent: *
Disallow: /old-campaign/
```

```html
<!-- /old-campaign/index.html -->
<meta name="robots" content="noindex">
```

This page was indexed by a search engine six months ago, before either of these directives existed. Both were added today.

**Question:** Does adding these two directives together get the page removed from search results?

**Answer:** Not reliably — and potentially never, as long as both directives remain as-is. The page may stay indexed indefinitely.

**Why:** `Disallow: /old-campaign/` tells the crawler not to **fetch** that path at all going forward. Since the crawler can no longer fetch the page, it can never see the `noindex` meta tag sitting inside it — the two directives conflict, and the crawl-block wins by making the deindex instruction unreachable. Worse, because the page was already indexed *before* the block was added, the search engine has no new opportunity to revisit it, notice `noindex`, and remove it — it may simply keep showing the old, now-unfetchable, indexed version indefinitely. The correct fix is to remove the `robots.txt` block (so the page stays crawlable), leave `noindex` in place, wait for the search engine to revisit and process it, confirm it's been deindexed, and only then optionally add a `robots.txt` block back if there's some other reason (crawl budget) to prevent future crawling.
