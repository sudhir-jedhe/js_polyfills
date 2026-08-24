# Next.js Interview Mastery

Companion repo to `js-interview-mastery` and `react-interview-mastery`, same deep structure: every topic is a
folder of folders (`theory/`, `snippets/`, `output-based/`, `scenarios/`, `interview-qa/`, `problems/`,
`assets/`, and `projects/` where it made sense) instead of flat files.

Covers the **App Router** (Next.js 13+), which is what current interviews ask about — Pages Router is covered
only where it's directly relevant as a comparison (see `12-patterns-anti-patterns`).

## Topics

| # | Topic | Folder |
|---|---|---|
| 01 | App Router Basics | [`01-app-router-basics`](./01-app-router-basics) |
| 02 | Rendering Strategies (SSR/SSG/ISR/CSR/PPR) | [`02-rendering-strategies`](./02-rendering-strategies) |
| 03 | Server vs Client Components | [`03-server-client-components`](./03-server-client-components) |
| 04 | Data Fetching & Caching | [`04-data-fetching-caching`](./04-data-fetching-caching) |
| 05 | API Route Handlers & Server Actions | [`05-api-route-handlers`](./05-api-route-handlers) |
| 06 | Middleware & Edge Runtime | [`06-middleware`](./06-middleware) |
| 07 | Metadata API & SEO | [`07-metadata-seo`](./07-metadata-seo) |
| 08 | Image & Font Optimization | [`08-image-font-optimization`](./08-image-font-optimization) |
| 09 | Dynamic Routes & Params | [`09-dynamic-routes-params`](./09-dynamic-routes-params) |
| 10 | Navigation & Linking | [`10-navigation-linking`](./10-navigation-linking) |
| 11 | Deployment & Performance | [`11-deployment-performance`](./11-deployment-performance) |
| 12 | Patterns & Anti-Patterns | [`12-patterns-anti-patterns`](./12-patterns-anti-patterns) |

## Projects worth running

- `05-api-route-handlers/projects/mini-notes-api/` — a small notes CRUD app using only App Router route
  handlers and an in-memory store, to see request/response handling end to end.

See [`SOURCE-MAP.md`](./SOURCE-MAP.md) — it also points you at
`js_polyfills/Next JS/job-applications-tracker-nextjs/`, a full real project you already built (Server
Actions, Drizzle, auth, charts, kanban) that's a much richer reference than any invented example once
you've got the fundamentals down here.

**Prerequisite:** this repo assumes `js-interview-mastery` (closures, async/await, event loop) and
`react-interview-mastery` (hooks, rendering, Context) — Next.js interview questions build directly on both.

## How to use this repo

1. **Learning a topic for the first time** — read `theory/`, then run the code in `snippets/` yourself.
2. **Weekly review** — skim `interview-qa/` across all topics.
3. **The night before an interview** — do `output-based/` and `scenarios/` only.
4. **Adding new material** — drop a new numbered file in the matching subfolder.
