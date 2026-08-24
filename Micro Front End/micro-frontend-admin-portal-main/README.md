# Multi-Tenant Admin Portal — Micro-Frontend Demo

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)
![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-ef4444?logo=turborepo)
![Yarn](https://img.shields.io/badge/Yarn-workspaces-2c8ebb?logo=yarn)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A small but production-style **micro-frontend** architecture built with **Next.js
Multi-Zones**, **TypeScript**, **Turborepo** and **Yarn workspaces** — deployable
entirely on **Vercel**, with **no backend** and **mock data only**.

**🔗 Live demo: https://mfe-demo-admin.vercel.app** — sign in with
`alice@example.com` or `bob@example.com` (password `password123`).

Four independently developed and deployed apps behave as **one product** on a
single domain:

```
abc.com/            -> shell      (host / landing)
abc.com/auth/*      -> auth        (login, logout, session)
abc.com/dashboard/* -> dashboard   (stats, projects, analytics)
abc.com/settings/*  -> settings    (profile, security)
```

> ⚠️ **DEMO ONLY.** Authentication is mocked (plaintext demo passwords, hand-rolled
> HMAC cookie). It demonstrates the *shape* of production auth — it is **not**
> production-grade auth. Do not reuse the auth code as-is.

---

## Table of Contents

1. [What is a micro-frontend?](#1-what-is-a-micro-frontend)
2. [Why this project uses micro-frontends](#2-why-this-project-uses-micro-frontends)
3. [Why these apps are separated](#3-why-these-apps-are-separated)
4. [Why not one micro-frontend per page](#4-why-not-one-micro-frontend-per-page)
5. [How the apps communicate](#5-how-the-apps-communicate)
6. [How authentication works](#6-how-authentication-works)
7. [How cookies work across a single domain (and across subdomains)](#7-how-cookies-work)
8. [Why not a shared Redux store for auth](#8-why-not-a-shared-redux-store-for-auth)
9. [How shared packages work](#9-how-shared-packages-work)
10. [Independent deployment](#10-independent-deployment)
11. [Vercel deployment](#11-vercel-deployment)
12. [Local development](#12-local-development)
13. [Production architecture](#13-production-architecture)
14. [Advantages & disadvantages](#14-advantages--disadvantages)
15. [When NOT to use micro-frontends](#15-when-not-to-use-micro-frontends)
- [Project structure](#project-structure)
- [Architecture diagram](#architecture-diagram)
- [Interview questions I can answer from this project](#interview-questions-i-can-answer-from-this-project)

> 📚 **Deep dive:** [docs/MICROFRONTEND-CONCEPTS.md](./docs/MICROFRONTEND-CONCEPTS.md)
> — how this route/path-based approach relates to Vercel's native Microfrontends
> (same concept) vs. runtime/component composition like Module Federation (a
> different concept this project intentionally skips).

---

## 1. What is a micro-frontend?

A **micro-frontend** applies the microservice idea to the browser: a large web app
is split into **independently developed, tested, and deployed** frontend apps, each
owning a **business domain** (a "bounded context"). The user still experiences one
seamless application.

Key properties:
- **Independent deployability** — ship `settings` without redeploying `dashboard`.
- **Team autonomy** — a team owns a zone end-to-end.
- **Technology independence** — a zone *could* use a different framework/version.
- **Isolated failure** — one zone being down doesn't take the whole app down.

## 2. Why this project uses micro-frontends

To demonstrate the concepts that come up in interviews and real large-org frontends:
domain boundaries, independent deploys, cross-app auth via cookies, shared design
system, and a composition layer — **without** the operational weight of Module
Federation, service meshes, or a backend.

## 3. Why these apps are separated

Each app is a **bounded context** with its own reason to change:

| App | Domain | Owns |
|-----|--------|------|
| `shell` | Host / composition | `/`, the landing page, and the rewrites that stitch zones together |
| `auth` | Identity | login, logout, forgot-password, session issuance |
| `dashboard` | Analytics & work | overview, projects, analytics |
| `settings` | Account | account, profile, security |

Separation lets four teams deploy on independent cadences and blast radiuses.

## 4. Why not one micro-frontend per page

**A micro-frontend is a bounded context, not a route.** Splitting every page into
its own deployable would create:
- dozens of deploy pipelines,
- duplicated chrome/state,
- a full page reload (or remote load) on every navigation *within* one domain,
- painful shared-state and versioning overhead.

So related pages live **inside the same zone**:

```
dashboard  owns  /dashboard, /dashboard/projects, /dashboard/analytics
settings   owns  /settings,  /settings/profile,   /settings/security
auth       owns  /auth/login, /auth/forgot-password, /auth/logout
```

Navigation *within* a zone is normal client-side routing; only crossing a **zone
boundary** is a hard navigation. Split by **domain**, not by **page**.

## 5. How the apps communicate

They are **loosely coupled**. In order of preference:

1. **The URL / navigation** — the primary mechanism. Cross-zone links are plain
   `<a href="/dashboard">`; the shell routes them to the right zone. Post-login the
   auth zone redirects to `/dashboard`.
2. **The shared session cookie** — every zone reads the same signed cookie to learn
   *who the user is*. No shared runtime, no prop-drilling across apps.
3. **Shared contracts** — `@portal/types` (TypeScript types) and `@portal/config`
   (constants, routes, mock data) keep zones in agreement at build time.

A heavier browser mechanism (`window.postMessage`, `CustomEvent`) is only needed if
zones are composed **in the same page** (e.g. iframes / Module Federation). This
project composes by **path**, so it doesn't need them — and deliberately avoids the
complexity. (See the interview section for when you *would* reach for them.)

## 6. How authentication works

There is **no backend**. Auth uses Next.js **Server Actions** and **Route Handlers**
(which run server-side on Vercel functions — part of the framework, not a separate
server).

Flow:

```
1. User submits /auth/login  (Server Action, runs on the server)
2. verifyCredentials(email, password)  against mock users
3. createSession(user)  ->  { userId, email, role, tenantId, issuedAt, expiresAt }
4. encodeSession()  ->  base64url(payload) + "." + HMAC-SHA256(payload, SECRET)
5. Set-Cookie: portal_session=<token>  (HttpOnly, Secure in prod, SameSite=Lax)
6. redirect -> /dashboard
7. Every protected page runs requireUser():
     read cookie -> verify HMAC + expiry -> load User -> or redirect to /auth/login
8. Logout (/auth/logout) sets the cookie with Max-Age=0 and redirects to login.
```

Why an **HMAC-signed** cookie? It lets **any** zone verify the session using only a
**shared secret** (`SESSION_SECRET`) — **no shared database, no shared memory**.
That is exactly what makes independent deployment possible.

**Two demo users** (password `password123`):

| Email | Role | Projects | Notifications |
|-------|------|----------|---------------|
| `alice@example.com` | admin | 25 | 4 |
| `bob@example.com` | user | 8 | 2 |

Log in as each to see fully **user-specific**, isolated data on the dashboard and
settings zones.

## 7. How cookies work

**This project (single domain).** Because everything is served from **one origin**
(`abc.com`), the session cookie is **host-only** and automatically shared across
**all paths** (`/auth`, `/dashboard`, `/settings`). No `Domain` attribute needed.
This is the simplest correct setup and why single-domain composition was chosen.

**The subdomain alternative (documented, not used).** If the zones lived on
`auth.example.com`, `dashboard.example.com`, etc., you'd set the cookie with:

```
Set-Cookie: portal_session=...; Domain=.example.com; Secure; HttpOnly; SameSite=Lax
```

`Domain=.example.com` tells the browser to send the cookie to **every**
`*.example.com` subdomain. The code already supports this — set `COOKIE_DOMAIN=.example.com`
(see `packages/config/src/cookie.ts`). In a real system this must be configured
carefully (exact parent domain, `Secure`, `SameSite`, and CSRF considerations).

**Local development.** In dev the shell proxies every zone, so the browser only ever
sees `localhost:3000` — one origin, so the cookie just works. (Bonus: browser
cookies ignore the port, so even direct hits to `localhost:3001..3003` share it.)

## 8. Why not a shared Redux store for auth

A single global Redux store shared across independently deployed apps would:
- **Recreate coupling** — every app would depend on the store's shape and version,
  defeating independent deployment.
- **Not survive navigation** — crossing a zone boundary is a fresh page load; the
  in-memory store is wiped. You'd need to rehydrate from *somewhere* anyway — and
  that somewhere is the cookie.
- **Be insecure for auth** — auth state in JS memory / localStorage is exposed to
  XSS and can't be `HttpOnly`.

So: **session lives in the signed HttpOnly cookie** (the single source of truth),
each zone reads it independently, and **UI state stays local** to each zone (its own
`useState`/Redux Toolkit if it wants one). See the memory note: prefer **Redux
Toolkit** for local RN/React state — but never as a *cross-app auth* store.

## 9. How shared packages work

Three workspace packages, consumed by every app and transpiled by Next
(`transpilePackages`):

| Package | Contents | Notes |
|---------|----------|-------|
| `@portal/types` | `User`, `Session`, `Role`, `DashboardStats`, … | Pure types, framework-agnostic. The **contract** between apps. |
| `@portal/config` | constants, `ROUTES`, `PORTAL_NAV`, mock data, `session` sign/verify, `cookie` options | Framework-agnostic. Server-only bits (`node:crypto`, mock passwords) are **never** imported into client components. |
| `@portal/ui` | `Button`, `Input`, `Card`, `Avatar`, `Navbar/AppLayout`, `Loading`, `ErrorMessage`, `EmptyState`, `Badge` | Presentational only. Imports **no** server code, so the shared sidebar can render in every zone and the four apps look like one. |

## 10. Independent deployment

Each app is a **separate Vercel project** pointing at its own folder
(`apps/<name>`). Deploying `settings` does not rebuild or redeploy `dashboard`. The
**shell** is the only project that knows where the others live (via the
`*_ZONE_URL` env vars used in its `next.config` rewrites).

## 11. Vercel deployment

### Two strategies

**Strategy A — separate domains / subdomains.** Each zone gets its own domain
(`auth.example.com`, …) and the cookie uses `Domain=.example.com`.
*Pros:* total isolation. *Cons:* more DNS, cross-subdomain cookie/CSRF care, less
"single app" feel.

**Strategy B — single domain, path-based (this project, recommended).** One public
domain; the shell rewrites `/auth`, `/dashboard`, `/settings` to each zone.
*Pros:* one origin ⇒ cookies "just work", cleanest UX, easiest to reason about.
*Cons:* the shell is a (thin, cacheable) routing dependency.

> **Recommendation:** Strategy B. It's the easiest to understand and demonstrate on
> Vercel, and it's the canonical **Next.js Multi-Zones** pattern.

### Note: Vercel's native Microfrontends vs. Multi-Zones rewrites

Vercel has a first-class **Microfrontends** product (a `microfrontends.json` group +
`@vercel/microfrontends`) that manages routing at the edge. This project was built
to work with it — **but the Vercel Hobby (free) tier caps a Microfrontends group at
2 projects**, and this app has 4. So the live demo uses **classic Next.js Multi-Zones
rewrites** instead: the shell composes the zones via `next.config` rewrites to each
zone's deployment URL. Same architecture, all four apps stay independently
deployable, and it runs entirely on the free tier. (On a Pro plan you could swap in
the native Microfrontends group with no change to the app code.)

### Step-by-step (Strategy B)

Create **4 Vercel projects** from this one repo (Add New → Project → same repo, set
**Root Directory** each time):

| Project | Root Directory | Public? |
|---------|----------------|---------|
| `mfe-auth` | `apps/auth` | internal |
| `mfe-dashboard` | `apps/dashboard` | internal |
| `mfe-settings` | `apps/settings` | internal |
| `mfe-shell` | `apps/shell` | **yes — this is the URL users visit** |

Set **Environment Variables** per project:

- **All four projects:**
  - `SESSION_SECRET` = a strong random string (**identical** in all four, so every
    zone can verify the cookie).
  - `NEXT_PUBLIC_BASE_URL` = the shell's public URL, e.g.
    `https://mfe-demo-admin.vercel.app` (use `https://`).
- **Shell only** (the host that rewrites):
  - `AUTH_ZONE_URL` = `https://<mfe-auth-url>.vercel.app`
  - `DASHBOARD_ZONE_URL` = `https://<mfe-dashboard-url>.vercel.app`
  - `SETTINGS_ZONE_URL` = `https://<mfe-settings-url>.vercel.app`
    (each zone's own production Vercel URL).
- **(Optional, subdomain mode only):** `COOKIE_DOMAIN` = `.example.com`. Leave unset
  for single-domain.

Deploy order: the three zones first (to get their URLs), then set the shell's
`*_ZONE_URL` vars and deploy the shell. Point your real domain at the **shell**.
No AWS / EC2 / NGINX / Docker / Kubernetes required.

## 12. Local development

Prereqs: **Node ≥ 20**, **Yarn 1.x** (classic).

```bash
yarn install          # install all workspaces
yarn dev              # turbo runs all 4 apps in parallel
```

Then open **http://localhost:3000** (the shell). It proxies the other zones:

| URL | Zone | Port (direct) |
|-----|------|---------------|
| http://localhost:3000 | shell | 3000 |
| http://localhost:3000/auth/login | auth | 3001 |
| http://localhost:3000/dashboard | dashboard | 3002 |
| http://localhost:3000/settings | settings | 3003 |

**Always browse via `:3000`** so the rewrites and single-origin cookie apply.
No `.env` is required locally — every value has a working dev default (including a
shared dev `SESSION_SECRET` fallback). To override, copy `.env.example` and set the
vars in your shell or a per-app `.env.local`.

Useful scripts:

```bash
yarn build        # build all apps (Turbopack)
yarn typecheck    # tsc --noEmit across every workspace
yarn lint         # (placeholder — next lint was removed in Next 16)
```

Try it: log in as `alice@example.com` / `password123`, note the admin data, log out,
then log in as `bob@example.com` — the dashboard and settings show Bob's data only.

## 13. Production architecture

```
                          ┌──────────────────────────────┐
   Browser  ── abc.com ──▶│  SHELL (host, Vercel project) │
                          │  next.config rewrites:        │
                          │   /auth/*      -> AUTH_ZONE    │
                          │   /dashboard/* -> DASHBOARD    │
                          │   /settings/*  -> SETTINGS     │
                          └───────┬───────────┬───────────┘
                        proxied   │           │  proxied
              ┌───────────────────┘           └───────────────────┐
              ▼                    ▼                               ▼
      ┌──────────────┐    ┌──────────────┐               ┌──────────────┐
      │ AUTH zone    │    │ DASHBOARD    │               │ SETTINGS     │
      │ basePath     │    │ basePath     │               │ basePath     │
      │ /auth        │    │ /dashboard   │               │ /settings    │
      └──────┬───────┘    └──────┬───────┘               └──────┬───────┘
             │  Set-Cookie        │  read cookie                 │  read cookie
             ▼                    ▼                               ▼
        portal_session  (HttpOnly, Secure, SameSite=Lax, HMAC-signed)
        one origin  ⇒  shared across every path, verified independently by each zone
```

## 14. Advantages & disadvantages

**Advantages**
- Independent deploys, team autonomy, clear domain boundaries.
- Isolated failure blast radius.
- Shared design system + types keep consistency without central coupling.
- Single origin ⇒ trivial cookie sharing and best UX.

**Disadvantages**
- More moving parts (4 projects, 4 pipelines) than a monolith.
- The shell is a routing dependency (mitigated: it's tiny and cacheable).
- Hard navigation across zone boundaries (no shared client router between zones).
- Requires discipline to keep shared packages versioned and compatible.

## 15. When NOT to use micro-frontends

- **Small app / small team.** The overhead outweighs the benefit — use a monolith
  (or a monorepo with one app).
- **Tightly coupled UI** that shares lots of live client state across "boundaries."
- **No independent-deploy need.** If everything always ships together, don't split.
- **Perf-critical flows** that can't tolerate any cross-zone hard navigation.

Rule of thumb: reach for micro-frontends when **team/deploy autonomy** is the
bottleneck — not merely for code organization (a monorepo already solves that).

---

## Project structure

```
multi-tenant-admin-portal/
├── apps/
│   ├── shell/                 # HOST — owns "/", rewrites to the zones
│   │   ├── app/               #   layout, landing page
│   │   ├── lib/session.ts     #   read-only session helpers
│   │   └── next.config.mjs    #   rewrites: /auth /dashboard /settings -> zones
│   ├── auth/                  # basePath /auth
│   │   ├── app/login/         #   Server Action + client form
│   │   ├── app/forgot-password/
│   │   ├── app/logout/route.ts
│   │   └── lib/session.ts
│   ├── dashboard/             # basePath /dashboard
│   │   ├── app/(overview)     #   /dashboard
│   │   ├── app/projects/      #   /dashboard/projects
│   │   ├── app/analytics/     #   /dashboard/analytics
│   │   ├── components/DashboardChrome.tsx
│   │   └── lib/session.ts     #   requireUser() protected-route guard
│   └── settings/              # basePath /settings
│       ├── app/(account)      #   /settings
│       ├── app/profile/       #   /settings/profile
│       ├── app/security/      #   /settings/security
│       ├── components/SettingsChrome.tsx
│       └── lib/session.ts
├── packages/
│   ├── types/                 # @portal/types — User, Session, Role, DashboardStats…
│   ├── config/                # @portal/config — constants, ROUTES, mock data,
│   │   └── src/               #   session sign/verify, cookie options
│   └── ui/                    # @portal/ui — Button, Card, Input, Avatar, AppLayout…
│       └── src/styles/globals.css   # the shared design system
├── turbo.json                 # task pipeline
├── tsconfig.base.json         # shared strict TS config
├── package.json               # yarn workspaces + turbo scripts
└── .env.example
```

## Architecture diagram

See [§13 Production architecture](#13-production-architecture) for the runtime
diagram and [§7 cookies](#7-how-cookies-work) for the auth/cookie flow.

---

## Interview questions I can answer from this project

**What is a micro-frontend?**
An independently developed, tested, and deployed frontend app that owns a business
domain; several compose into one product the user sees as a single app.

**Why use micro-frontends?**
Team autonomy and independent deployability at scale — ship one domain without
redeploying the rest, and isolate failure.

**Micro-frontend vs monolith?**
Monolith = one build, one deploy, simplest for small teams. Micro-frontends = many
builds/deploys, autonomy and isolation at the cost of operational overhead. Choose by
team/deploy needs, not code size.

**Micro-frontend vs monorepo?**
Different axes. A **monorepo** is a *source-code* layout (many packages, one repo). A
**micro-frontend** is a *runtime/deployment* boundary. You can have either without
the other.

**Can micro-frontends exist inside a monorepo?**
Yes — this project is exactly that: one repo, four independently deployable apps plus
shared packages. The monorepo gives shared tooling/types; each app still deploys on
its own.

**How are micro-frontends deployed?**
Independently. Here: four separate Vercel projects from one repo, each with its own
Root Directory and pipeline. The shell composes them via rewrites (Multi-Zones).

**How does authentication work between micro-frontends?**
A signed, HttpOnly session cookie shared across the origin. Each zone independently
verifies the HMAC with a shared `SESSION_SECRET` — no shared DB or memory. Login is a
Server Action that sets the cookie; protected pages call `requireUser()`.

**How can cookies work across subdomains?**
Set `Domain=.example.com`; the browser then sends the cookie to every
`*.example.com` subdomain (subject to `Secure`/`SameSite`). On a single domain you
don't even need that — a host-only cookie covers all paths.

**Why not share one Redux store?**
It recreates coupling, doesn't survive cross-zone page loads, and is insecure for
auth (JS-readable, not HttpOnly). Session belongs in the cookie; UI state stays local
per zone.

**How do micro-frontends communicate?**
Primarily URLs/navigation and the shared cookie; shared types/constants at build
time. For same-page composition you'd add `postMessage`/`CustomEvent` — not needed
for path-based composition.

**What should be shared between micro-frontends?**
Contracts (types), a design system (UI), and cross-cutting config/routing. **Not**
business logic or live application state.

**Should every route be a separate micro-frontend?**
No. A micro-frontend is a **bounded context**, not a page. Related pages live in one
zone; only domain boundaries become separate deployables.

**What happens if one micro-frontend is down?**
Only that zone's routes fail; the rest keep working (isolated failure). The shell can
show a fallback for the dead path. A monolith would take everything down.

**How would you scale this architecture?**
Add zones per new domain; give each team its own project/pipeline; cache the shell
edge-side; version shared packages; add health checks and per-zone fallbacks; move
mock auth to a real IdP/session service.

**What are the disadvantages of micro-frontends?**
Operational overhead, versioning of shared code, possible duplication, harder
end-to-end testing, and hard navigations across zone boundaries.

**How would you migrate a monolith to micro-frontends?**
Strangler-fig: stand up a shell/host, carve out one bounded context into its own
deployable behind a rewrite, shift traffic, repeat. Extract shared UI/types into
packages first so both sides stay consistent during the migration.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Server Actions, Route Handlers) |
| UI | React 19 |
| Language | TypeScript (strict) |
| Monorepo | Turborepo + Yarn workspaces |
| Composition | Next.js Multi-Zones (path-based, single domain) |
| Auth | Mock, HMAC-signed HttpOnly cookie (**DEMO ONLY**) |
| Tests | Vitest |
| Lint | ESLint (flat config) |
| Hosting | Vercel (4 independent projects) |

## Scripts

| Command | Does |
|---------|------|
| `yarn dev` | Run all four apps (open http://localhost:3000) |
| `yarn build` | Build every app |
| `yarn typecheck` | `tsc --noEmit` across all workspaces |
| `yarn test` | Run Vitest |
| `yarn lint` | Run ESLint |

## Contributing

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for setup,
conventions, and the quality gates (lint / typecheck / test / build).

## Author

**Muhammad Afzal** — [@muhammadafzal-dev](https://github.com/muhammadafzal-dev)

## License

[MIT](./LICENSE) © 2026 Muhammad Afzal

> Reminder: authentication here is **mock / demo only** and must not be used as real
> production auth.
