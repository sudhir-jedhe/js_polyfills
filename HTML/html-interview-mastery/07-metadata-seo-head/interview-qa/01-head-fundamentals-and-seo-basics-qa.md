*** copy 01-head-fundamentals-and-seo-basics-qa.md ***

# Interview Q&A — `<head>` Fundamentals & SEO Basics

**Q: Why must `<meta charset>` appear within the first 1024 bytes of a document?**
The browser needs to know the character encoding before it can reliably parse the rest of the document's text — if the declaration comes too late, the browser may have already started parsing with a guessed or default encoding, risking misinterpreted (garbled) non-ASCII characters in everything parsed before the declaration was reached.

**Q: What does the viewport meta tag actually do, and what breaks without it?**
`<meta name="viewport" content="width=device-width, initial-scale=1">` sets the mobile browser's virtual viewport to match the device's actual width at 1:1 zoom. Without it, mobile browsers render the page at a desktop-like virtual width and scale the result down to fit the screen — producing tiny, unreadable text regardless of how much responsive CSS the page has, since media queries evaluate against that virtual (not physical) width.

**Q: Is `maximum-scale=1` or `user-scalable=no` ever a good idea on the viewport tag?**
Generally no — disabling pinch-zoom is a real accessibility problem for users with low vision who rely on zooming to read content; modern accessibility guidance recommends never disabling user scaling.

**Q: Does `<meta name="description">` directly affect search ranking?**
Not directly for most search engines — but it strongly affects **click-through rate** on results where it's shown, since it's the summary text a user reads before deciding to click. Search engines may also override it with an auto-extracted snippet if it's missing or judged not to match the query well.

**Q: What's a practical target character length for `<title>` and meta description before SERP truncation?**
Roughly 50-60 characters for `<title>`, roughly 150-160 characters for meta description — both are actually pixel-width-based truncation, not strict character counts, but these ranges are the practical working targets.

**Q: Why is having the exact same `<title>` on every page of a site a problem?**
It removes any way for search engines or users to distinguish pages from each other in search results, browser tabs, or bookmarks, and actively suppresses each individual page's ability to rank distinctly for its own specific topic/keywords.

**Q: A SPA sets `document.title` via JavaScript on route change but has no server-side rendering. What's the SEO risk?**
If the crawler indexing the site doesn't execute JavaScript (or does so with limits/timeouts), it may index every route under the same generic fallback title from the initial HTML response, rather than each route's actual client-set title — SSR or prerendering is generally needed to reliably fix this.
