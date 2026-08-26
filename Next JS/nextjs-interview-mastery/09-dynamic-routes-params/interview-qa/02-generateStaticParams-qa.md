# Interview Q&A: `generateStaticParams` and `dynamicParams`

**Q: What is `generateStaticParams` the App Router equivalent of, and what does it do?**
A: It's the App Router replacement for `getStaticPaths` from the Pages Router. It runs at build time and returns an array of objects (keys matching the route's dynamic segment names) that tells Next.js which values of the segment to pre-render into static HTML.

**Q: What happens when a user requests a dynamic route value that wasn't returned by `generateStaticParams`?**
A: It depends on `dynamicParams`. With the default `true`, Next.js renders the page on-demand at request time (like SSR) and caches the result for future requests — effectively lazy static generation. With `dynamicParams = false`, any value not in the pre-rendered list returns a 404 immediately, without ever running the page component.

**Q: When would you deliberately set `dynamicParams = false`?**
A: When the set of valid values is genuinely closed and known — a fixed set of marketing landing pages, a finite list of supported locales, or any route where receiving a value outside the pre-rendered list should be treated as an invalid/malicious request rather than "a new legitimate page that just hasn't been built yet." It's the wrong choice for anything with an open-ended or growing dataset, like blog posts or user profiles, where you'd unintentionally 404 legitimate content.

**Q: Does `generateStaticParams` work with `searchParams`?**
A: No. `generateStaticParams` only enumerates values for path segments (folders named `[x]`). There's no equivalent for pre-rendering specific query string combinations — a page that reads `searchParams` is dynamically rendered per-request regardless of what `generateStaticParams` returns, because query strings aren't part of the page's static "identity" the way path segments are.

**Q: How does `generateStaticParams` interact with `revalidate`?**
A: They're independent. `generateStaticParams` decides *which* paths get built ahead of time; `revalidate` (module-level export or per-`fetch` option) decides *how often* any given rendered path — whether it was originally pre-rendered or rendered on-demand — gets regenerated in the background. You can pre-render 5 posts and revalidate all posts (pre-rendered or not) hourly.
