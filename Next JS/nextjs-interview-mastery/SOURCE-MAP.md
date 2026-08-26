# Source Map — js_polyfills/Next JS (+ root-level Next.js notes) → this repo

Note: this pass hit a device authentication issue (`untrusted_device` — the Claude desktop app needs you to
sign in again) partway through migrating images, so `assets/` folders are still placeholders in this delivery.
The mapping below is accurate and ready — once you're signed back in, ask and the listed images/PDF/project
will get copied in on the next pass.

## Images identified for migration (not yet copied — pending re-auth)

| New topic | Source file(s) in `js_polyfills/` |
|---|---|
| `01-app-router-basics` | `Next JS/Routing.jpeg`, `Next js app rout.jpeg`, `Next.js App Router Project.jpeg`, `Next JS/essentials.jpeg` |
| `02-rendering-strategies` | `SSR vs CSR vs SSG.jpeg`, `SSR vs ISR vs PPR .jpeg`, `Next JS/Partial Prerendering (PPR).jpeg` |
| `03-server-client-components` | `client vs server component.jpeg`, ` Server Components vs Client Components.jpeg` (note leading space in filename) |
| `04-data-fetching-caching` | `Next JS/cache.jpeg`, `Next JS/cacheTag.jpeg`, `Next JS/connection().jpeg` |
| `06-middleware` | `Next JS/forbidden.jpeg` (the `forbidden()` API is commonly used from middleware-guarded routes) |
| `09-dynamic-routes-params` | `Next JS/generateStaticParams.jpeg` |
| `11-deployment-performance` | `5 Next.js Performance Mistakes.jpeg`, `Next JS/after() .jpeg` |
| `12-patterns-anti-patterns` | `React Router vs Next.js App Router.jpeg`, `React vs Next.jpeg` |

## Real project worth studying (not copied — 200+ files, browse in place)

`js_polyfills/Next JS/job-applications-tracker-nextjs/` is a full, production-shaped Next.js 15 App Router
app you already built: route groups (`app/(app)/...`), Server Actions (`actions/`), Drizzle ORM + Postgres
(`db/`, `drizzle/`), better-auth (`lib/auth.ts`), a command palette, kanban board, calendar view, analytics
charts, CSV export, and a full shadcn/ui component set. It's a stronger real-world reference than anything
this repo can invent — worth reading end-to-end after `05-api-route-handlers` and `10-navigation-linking`,
especially:
- `actions/applications.ts` — real-world Server Actions with validation
- `app/(app)/layout.tsx` + `app/(app)/*/page.tsx` — route group + nested layout pattern in production
- `lib/search-params.ts` + `hooks/use-application-filters.ts` — URL-state-driven filtering (a very common interview scenario topic)
- `components/analytics/lazy-charts.tsx` — real `next/dynamic` code-splitting usage

## What wasn't touched

- `Next JS/TIS Work Screen Shots/` (130+ generic screenshots, not Next.js-specific) — skipped.
- `Next JS/fwddemofedevelopment/` (email-forward image assets, not Next.js-specific) — skipped.
- `1786622914201.pdf` (93MB PDF in `Next JS/`) — worth a manual skim, too large to process automatically.
