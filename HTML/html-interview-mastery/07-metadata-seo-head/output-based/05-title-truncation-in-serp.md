*** copy 05-title-truncation-in-serp.md ***

# Output: A `<title>` That's Too Long for the SERP

```html
<title>Buy the Best Ultra-Lightweight Waterproof Trail Running Shoes for Men and Women in All Sizes | ExampleStore Official Site</title>
```

**Question:** What actually shows up in a Google search result for this page?

**Answer:** Something like `"Buy the Best Ultra-Lightweight Waterproof Trail Running Shoes for…"` — truncated with an ellipsis well before reaching `"ExampleStore Official Site"` at the end, which never becomes visible in the SERP snippet at all.

**Why:** Search engines display titles up to roughly 50-60 characters' worth of pixel width (not a fixed character count, but that's the practical working range) before truncating — this title is far longer than that. The truncation happens from the end, so anything placed late in the title (here, the brand name) is the first thing to get cut. The full `<title>` text still exists in the document and is still used by the search engine for matching/relevance and for the browser tab, but the *visible* SERP snippet only shows the portion that fits. A better version front-loads the most distinctive keywords and moves the brand name earlier or drops it: `"Trail Running Shoes for Men & Women | ExampleStore"`.
