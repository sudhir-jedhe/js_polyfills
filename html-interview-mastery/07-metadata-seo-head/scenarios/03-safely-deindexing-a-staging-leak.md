# Scenario: A Staging Subdomain Got Indexed by Accident

**Scenario:** A staging environment at `staging.example.com` — a full mirror of production, used for QA — was accidentally left crawlable, and Google has indexed hundreds of pages from it, now showing up in search results alongside (and sometimes instead of) the real production pages. The team wants it deindexed completely and never crawled again. What's the correct sequence of steps?

**Diagnosis:** This requires both **deindexing** (removing already-indexed pages from search results) and **preventing future crawling** — and, critically, these two goals require the opposite short-term action from each other, since deindexing an already-crawled page requires the crawler to revisit it and see a `noindex` instruction, which is impossible if crawling is blocked first.

**Correct sequence:**

**Step 1 — add `noindex` to every page on staging, and leave it crawlable for now:**

```html
<meta name="robots" content="noindex, nofollow">
```

Applied site-wide on `staging.example.com` (e.g., via a middleware/template applied to every response on that specific host, so there's no risk of missing a page). `nofollow` here also prevents the crawler from following internal links deeper into the staging site while this transition is in progress.

**Step 2 — wait for the search engine to revisit and process the `noindex` directive**, and confirm via search operators (e.g., `site:staging.example.com`) that the page count in the index is dropping over subsequent days/weeks.

**Step 3 — once confirmed fully deindexed, THEN add a `robots.txt` block (or, better, actual authentication) to prevent future crawling:**

```
# staging.example.com/robots.txt
User-agent: *
Disallow: /
```

**Why the order matters — the exact trap to avoid:** Doing step 3 before step 1/2 completes would prevent the crawler from ever revisiting the already-indexed pages to see the `noindex` tag, potentially leaving hundreds of stale pages indexed indefinitely — the same trap covered in this topic's `robots.txt`-vs-robots-meta theory file, just at staging-environment scale.

**Better long-term fix — don't rely on `robots.txt`/`noindex` for staging at all:** Since `robots.txt` is a voluntary convention (not access control) and staging is presumably not meant to be publicly accessible in the first place, the more robust fix is putting staging behind HTTP basic auth or IP allow-listing — removing the possibility of accidental crawling/indexing entirely, rather than depending on crawlers correctly honoring exclusion directives.
