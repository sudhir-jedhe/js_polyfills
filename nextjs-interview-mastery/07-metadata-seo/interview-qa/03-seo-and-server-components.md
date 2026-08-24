# Interview Q&A: SEO and Server Components

**Q: Why do App Router apps generally have a stronger SEO baseline than a traditional client-fetching SPA, without extra effort?**
A: Because Server Components fetch and render content during server rendering, before any HTML is sent to the client — the actual content (not a loading skeleton) is present in the very first HTML response a crawler or link-unfurling bot receives. A client-fetching pattern (`useEffect` + `fetch` + `setState`) instead ships an empty shell first, relying on the crawler executing JavaScript and waiting long enough for the fetch to resolve — slower, less reliable, and dependent on crawler-specific JS execution budgets.

**Q: Does this mean Client Components are bad for SEO and should be avoided?**
A: No — the rule of thumb is about where the *content that needs to be indexed* lives, not a blanket avoidance of Client Components. A product page's title, description, and body text should render via Server Components so they're in the initial HTML; an "Add to cart" button's interactivity is fine as a Client Component nested inside that Server Component, since interactive widgets aren't what search engines are trying to index in the first place.

**Q: How does `generateMetadata()` running server-side specifically help SEO, beyond the page content itself being server-rendered?**
A: It guarantees the `<title>` and Open Graph/Twitter tags are already correct in the very first HTML response, with no dependency on client JS executing to inject them (as older patterns using `document.title = ...` or head-management libraries required). Search engines and social platforms that fetch a URL without executing JavaScript still see fully correct metadata, which client-side title-setting approaches could never guarantee.

**Q: If metadata resolution is server-side and can involve a fetch (`generateMetadata` calling a data source), does that slow down the page?**
A: It can — Next.js waits for `generateMetadata()` to resolve before it starts streaming the `<head>`, which is a deliberate tradeoff (correct title/OG tags matter enough to justify the wait) but does mean a slow metadata-fetching call adds to time-to-first-byte for that route. The practical mitigation is the same as any other slow fetch: cache it appropriately (`next: { revalidate }` or `tags`) so most requests resolve from cache rather than hitting the origin data source on every render.
