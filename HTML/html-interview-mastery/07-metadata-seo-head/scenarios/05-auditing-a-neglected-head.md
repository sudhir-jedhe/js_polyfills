*** copy 05-auditing-a-neglected-head.md ***

# Scenario: Auditing a Legacy Site's Neglected `<head>`

**Scenario:** You've inherited a five-year-old marketing site. A quick look at the `<head>` across several pages reveals: no `viewport` meta tag, a `<title>` that's identical ("Welcome to Acme Corp") on every single page, no meta description anywhere, no canonical tags, an old `robots.txt` that blocks `/blog/` entirely (blog posts are meant to be public and indexable), and no Open Graph tags at all. Prioritize and fix the issues.

**Diagnosis and prioritization:**

1. **Missing `viewport` meta tag — highest priority, affects every visitor on mobile immediately.** Without it, the entire site renders at desktop-scale on phones regardless of any responsive CSS already written, directly harming usability for what's likely a majority of traffic today.
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```

2. **`robots.txt` blocking `/blog/` — high priority, actively suppressing organic search traffic the site should be getting.** Every blog post is currently uncrawlable, meaning none of them can ever be indexed or ranked, regardless of content quality. This is very likely the single biggest traffic-limiting issue on the list.
   ```
   # remove this line entirely:
   # Disallow: /blog/
   ```

3. **Identical `<title>` on every page — high priority for SEO and usability.** Search engines and users alike can't distinguish pages from each other in results or browser tabs/bookmarks; this actively suppresses each individual page's ability to rank for its own specific topic.
   ```html
   <!-- per-page, populated from page-specific content -->
   <title>Enterprise Cloud Backup Solutions | Acme Corp</title>
   ```

4. **Missing meta descriptions — medium priority.** Doesn't block indexing, but search engines auto-generate a snippet instead, usually worse than a deliberately written one — directly costs click-through rate on pages that otherwise rank fine.

5. **Missing canonical tags — medium priority, preventative.** Not causing an active problem yet if the site has no known URL-duplication issues (no tracking params, no `www`/non-`www` split), but cheap to add defensively (self-referencing canonicals) before any future duplication issue arises.

6. **Missing Open Graph tags — lower priority, but easy win.** Doesn't affect search ranking, but directly affects how the site looks when marketing shares links on social platforms — worth doing, just after the above.

**Why this order:** Items 1-3 have a measurable, ongoing negative impact on real users or real search visibility right now; items 4-6 are either preventative or affect a narrower slice of traffic (social sharing specifically) — fixing them in this order gets the highest-impact wins first rather than treating every `<head>` gap as equally urgent.
