# Interview Q&A: Pages Router vs. App Router

**Q: What's the App Router equivalent of `getStaticPaths`'s `fallback: 'blocking'` and `fallback: false` options?**
A: `fallback: 'blocking'` maps to `dynamicParams = true` (the default) — unlisted paths render on-demand at request time. `fallback: false` maps to `dynamicParams = false` — unlisted paths 404 immediately instead of rendering.

**Q: If you're porting `getServerSideProps` to the App Router, what `fetch` cache option gives equivalent behavior?**
A: `{ cache: 'no-store' }` (or simply omitting caching options where the default for that context is uncached) — this forces a fresh fetch on every request, matching `getServerSideProps`'s "always run server-side, per-request, no caching" behavior.

**Q: Why does the App Router not have a direct equivalent of `getInitialProps`?**
A: `getInitialProps` was already considered legacy/discouraged in the Pages Router itself (superseded by `getServerSideProps`/`getStaticProps`) because it disabled automatic static optimization and ran on both server and client in ways that were hard to reason about. The App Router's data-fetching model (async Server Components) doesn't have a comparable ambiguous dual-execution concept to replicate.

**Q: A candidate says "the App Router is strictly better, there's no reason to ever use Pages Router." How would you push back?**
A: That overstates it. Plenty of production codebases are on Pages Router for good reasons — a full migration is real engineering effort with real risk, and Pages Router remains fully supported, not deprecated. There are also narrower technical cases (certain third-party libraries or patterns not yet compatible with Server Components, or teams with heavy investment in Pages-Router-specific tooling) where staying on Pages Router is a reasonable, deliberate choice rather than a mistake.
