# Interview Q&A: Metadata API Fundamentals

**Q: When must you use `generateMetadata()` instead of a static `metadata` export?**
A: Whenever the metadata's values depend on data that isn't known until request/build time — most commonly a dynamic route segment like `[slug]` or `[id]` where the title needs to reflect the actual fetched entity (a blog post's real title, a product's real name). If the title/description are the same for every visit to a given route, a static `metadata` object is simpler and sufficient.

**Q: Doesn't fetching the same data in both `generateMetadata()` and the page component double the network/DB load?**
A: Not in practice — Next.js deduplicates identical `fetch()` calls made during the same render/request via request memoization, so calling `getPost(params.slug)` in both places resolves the second call from an in-memory cache rather than issuing a second network request. This only applies automatically to `fetch`; for a non-fetch data source (a direct DB client call), you'd wrap it in React's `cache()` function to get the same deduplication behavior.

**Q: Can a Client Component export `metadata`?**
A: No — it's a build-time error. Metadata is resolved entirely server-side as part of building the document `<head>` before any HTML streams to the client, which is incompatible with a Client Component's browser-executable nature. The fix is always to keep the `metadata`/`generateMetadata` export in a Server Component (`page.jsx` or `layout.jsx`) and extract interactive parts into a separate Client Component it renders.

**Q: What does `metadataBase` do and why does it matter?**
A: It's set once (typically in the root layout) to a `URL` object representing the site's canonical origin, and it lets every relative path used elsewhere in metadata (`openGraph.images`, canonical URLs, etc.) resolve automatically to a full absolute URL in the rendered output. Without it, relative paths are passed through unresolved, which many social-platform crawlers and some SEO tools fail to handle correctly — a very common cause of "my OG image doesn't show up" bug reports.
