# Build Output Types: Node.js Server vs. Static Export

Next.js can produce a couple of fundamentally different deployment artifacts from the same codebase, and picking the right one — or knowing why a given hosting target forces a particular one — is a practical decision every team eventually has to make, not just theory.

## The default: Node.js server output

Without any special config, `next build` produces an output designed to run under a Node.js server (or, on platforms like Vercel, an equivalent managed runtime). This is the mode that supports the App Router's full feature set: Server Components that fetch data at request time, Route Handlers (API routes), Server Actions, Incremental Static Regeneration (ISR — statically generated pages that revalidate on a timer or on-demand), and Middleware. Most production Next.js apps run this way, deployed to Vercel, a Node.js host, or a containerized environment (Docker on any cloud provider).

## Static export: `output: 'export'`

```js
// next.config.js
module.exports = {
  output: 'export',
};
```

Running `next build` with this config produces a folder of plain static HTML, CSS, and JS files — no Node.js server required at all. You can host the result on any static file host: S3 + CloudFront, GitHub Pages, Netlify's static tier, a plain nginx box. This is attractive for content that's genuinely static at build time and doesn't need a server runtime — a marketing site, a documentation site, a portfolio.

## What static export gives up

This is the part that matters most for interview and architecture-decision purposes — static export is not a strict subset of features with a smaller server footprint, it's a **hard constraint boundary**:

- **No Server Components that fetch at request time** — every page must be fully resolvable at build time. A Server Component page using `searchParams`, reading cookies, or doing anything request-time-dependent is incompatible.
- **No Route Handlers that do dynamic work** — API routes are not supported at all in static export mode (there's no server to run them on); any backend logic needs to live in a separately-deployed API, not in `app/api/*`.
- **No ISR / on-demand revalidation** — there's no running server to regenerate a page after a `revalidate` timer or a webhook-triggered revalidation call; everything is generated exactly once, at `next build` time, and stays frozen until the next deploy.
- **No Middleware** — middleware requires a running edge/server process intercepting requests; a static file host just serves files.
- **`next/image`'s default optimizer is unavailable** — the built-in image optimization API is a server endpoint; static export requires either `images: { unoptimized: true }` (serving originals as-is) or a third-party loader that can optimize images without a Next.js server (e.g., a CDN-based image service).
- **Dynamic routes require `generateStaticParams`** — since nothing can render on-demand, every value of every dynamic segment you want servable must be explicitly enumerated at build time (`dynamicParams` effectively behaves as if forced to the "closed set" — unlisted values simply don't exist in the output).

## Choosing between them

The decision is really: does any part of the app need a request-time server-side computation (personalized content, live data, auth-gated pages, webhooks, on-demand revalidation)? If yes, static export is disqualified outright for that route, and mixing modes within one deployment isn't supported — `output: 'export'` is an all-or-nothing setting for the whole app. Teams that start with static export and later need even one dynamic feature (a contact form's server-side handler, a personalized dashboard) typically have to migrate off it entirely rather than incrementally opting one route back into server rendering.
