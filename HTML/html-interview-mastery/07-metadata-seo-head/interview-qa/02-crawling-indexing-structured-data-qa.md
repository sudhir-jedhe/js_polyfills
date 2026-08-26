*** copy 02-crawling-indexing-structured-data-qa.md ***

# Interview Q&A — Crawling, Indexing & Structured Data

**Q: What's the core difference between `robots.txt` and the `<meta name="robots">` tag?**
`robots.txt` is a site-level, path-based instruction about whether a crawler may **fetch** a URL at all — it operates before the page is ever requested. The robots meta tag is a page-level instruction about whether a page, once fetched, should be **indexed**/have its links **followed** — it requires the crawler to have already fetched the page to read it.

**Q: If a page is blocked in `robots.txt` AND has `noindex` in its meta tag, what happens?**
The `noindex` instruction is never seen, because the crawler is prevented from fetching the page in the first place by the `robots.txt` block — the crawl-block effectively wins by making the page-level instruction unreachable. If the page was already indexed before the block was added, it can remain indexed indefinitely, since the crawler can't revisit it to notice the `noindex` tag.

**Q: What's the correct way to fully deindex an already-indexed page?**
Add `noindex` to the page and leave it crawlable (don't block it in `robots.txt`), wait for the search engine to revisit and process the directive, confirm deindexing, and only then optionally block future crawling if desired for other reasons.

**Q: Is `robots.txt` a security mechanism for hiding sensitive URLs?**
No — it's a voluntary convention that well-behaved crawlers respect, but the file itself is publicly readable and lists exactly the paths being "hidden," and nothing prevents a non-compliant crawler (or a human) from simply requesting a disallowed path directly. Actual protection requires authentication or access control, not `robots.txt`.

**Q: What's `rel="canonical"` used for, and how does it differ from `noindex`?**
`canonical` tells search engines "this page is a duplicate/variant of that other URL — consolidate ranking signal there," while still allowing this page to be crawled and even shown in results (typically redirected in display to the canonical URL). `noindex` says "don't show this page in results at all." Canonical is for legitimate duplicates you want signal consolidated from; `noindex` is for pages that shouldn't appear in search results regardless of duplication.

**Q: What format does Google recommend for structured data, and why is it preferred over microdata/RDFa?**
JSON-LD — a single self-contained `<script type="application/ld+json">` block, kept entirely separate from the visible page markup. This is preferred over microdata/RDFa, which require scattering `itemprop`/`itemscope`-style attributes throughout the visible HTML itself, making structured data harder to maintain independently of markup/design changes.

**Q: Does adding valid structured data guarantee a rich result shows up in search?**
No — it makes the page *eligible* for that rich result type; search engines still apply their own independent quality, relevance, and trust checks before actually rendering the enhanced snippet.

**Q: What's the risk of structured data that doesn't match the page's actual visible content?**
It's treated as manipulative under most search engines' structured data guidelines and can trigger a manual action/penalty — a fabricated `aggregateRating` with no visible reviews on the page is a commonly cited example of this violation.
