# A Practical Decision Framework for Choosing a Rendering Strategy

Rather than memorizing definitions, it helps to run every route through the same short sequence of questions during design/code review.

**1. Is the content identical for every visitor, and does it change infrequently (hours/days, not seconds)?**
If yes → **SSG**. Marketing pages, documentation, terms of service, most blog posts. Build-time generation gives you the fastest possible response and the cheapest hosting cost, with zero per-request server work.

**2. Same as above, but the content changes periodically and you don't want to trigger a full rebuild for every content update?**
If yes → **ISR**. Product catalogs, blog listings backed by a CMS, pricing pages that update occasionally. Pick a `revalidate` interval that matches how stale you're willing to let content get, or use on-demand `revalidateTag`/`revalidatePath` for "publish and see it now" flows.

**3. Does the content depend on request-specific information — the requesting user's identity, cookies, headers, or truly can't be cached at all for correctness/compliance reasons?**
If yes → **SSR** (dynamic rendering). Account dashboards, personalized recommendation feeds, anything reading `cookies()`/`headers()` to make a per-user decision, pages showing real-time inventory that must never show a stale "in stock."

**4. Is the "content" actually client-side interactivity, live/streaming data, or dependent on browser-only APIs — where server-rendering the initial state buys little?**
If yes → **CSR** for that piece (often just a component, not the whole route). Live tickers, drag-and-drop editors, WebSocket-driven views, anything behind `localStorage`/`window`/geolocation.

**Applying it to three concrete page types:**

- **A blog post page (`/blog/[slug]`).** Content is the same for every reader and changes rarely once published → **SSG**, or **ISR** with a longer revalidate window (e.g., an hour) if the CMS allows post-publish edits like typo fixes that should surface without a redeploy. Not SSR — there's no per-request reason to regenerate identical content on every hit, wasting server resources. Not CSR — you want the article text in the initial HTML for SEO and instant readability.

- **A live stock ticker page.** Prices change multiple times per second and are meaningless if cached even briefly → **CSR** for the price-streaming component itself (WebSocket or aggressive polling), typically wrapped in a server-rendered shell (page layout, symbol metadata) that can be SSG/ISR. Pure SSR would still only be as fresh as the last request and can't push updates without the user refreshing — CSR's client-side subscription is the only strategy that matches the actual freshness requirement.

- **A marketing landing page.** Same content for everyone, changes only on redeploys or rare copy updates, and SEO/first-paint speed matter a lot for conversion → **SSG**. No per-user personalization, no live data — there's no reason to pay any per-request server cost here at all.

The underlying principle across all three: match the rendering strategy to how the content's *freshness requirement* and *audience-specificity* actually behave, not to habit or what's easiest to write.
