# Micro-Frontend Concepts — What This Project Is (and Isn't)

A reference for understanding **which** micro-frontend approach this project uses,
how it relates to Vercel's native Microfrontends product, and what the *other*
approaches are (for interviews and future extension).

---

## TL;DR

- This project uses **route / path-based composition** (a.k.a. **Multi-Zones**).
- **Vercel's native Microfrontends** product is the **same concept** — managed for
  you at the edge instead of hand-wired in `next.config`. Not a different idea.
- The genuinely **different** concept is **runtime / component-level composition**
  (Module Federation, Web Components, iframes), where several micro-frontends render
  **in the same page at once**. This project intentionally does **not** do that.

---

## The three integration stages

Every micro-frontend approach "integrates" the pieces at one of three stages:

| Stage | How pieces combine | Examples | Same page? |
|-------|--------------------|----------|------------|
| **Build-time** | Published as packages, bundled together at build | npm packages, monorepo imports | Yes, but **not** independently deployable → arguably not a true MFE |
| **Server / edge-time** | A router/proxy assembles or routes per request | **Next.js Multi-Zones**, **Vercel Microfrontends**, Server-Side Includes (SSI/ESI), Tailor, Podium | Usually **whole page per app** (routing), or fragment stitching (SSI) |
| **Run-time (browser)** | The browser loads pieces from multiple apps and composes them live | **Module Federation** (Webpack/rspack), **Web Components**, **iframes**, single-spa | **Yes — many apps on one page** |

This project sits in the **server/edge-time → routing** row.

---

## Approach taxonomy (and where we are)

### 1. Route / path-based composition ← **THIS PROJECT**

One host owns the domain and routes each **path prefix** to a whole, independently
deployed app.

```
abc.com/          → shell (host)
abc.com/auth/*    → auth app
abc.com/dashboard/* → dashboard app
abc.com/settings/*  → settings app
```

- **Two implementations of the SAME concept:**
  - **Next.js Multi-Zones** (what we use): the host app declares `rewrites()` in
    `next.config` that proxy each prefix to the zone's deployment URL.
  - **Vercel Microfrontends** (managed): a `microfrontends.json` group; Vercel does
    the routing at the edge. Swappable with zero app-code change. *(We don't use it
    only because the free Hobby tier caps a group at 2 projects; our app has 4.)*
- **Composition granularity:** whole page per app. Navigating **within** a zone is
  normal client routing; crossing a **zone boundary** is a hard navigation.
- **Pros:** simple, strong isolation, independent deploys, tech independence per
  zone, one origin ⇒ trivial cookie/auth sharing.
- **Cons:** no shared client router across zones (hard nav on boundaries); can't put
  two apps' UI on the **same** page.

### 2. Runtime / component-level composition (the "different" concept)

Multiple micro-frontends render **simultaneously in one page**. A shell page mounts
remote components/widgets owned by other teams.

- **Module Federation** (Webpack 5 / rspack): app A exposes a component; app B
  imports it **at runtime** over the network. This is the "virtual/remote component"
  idea — e.g. a shared **video player** or **header** loaded from another deployment
  into the current page.
- **Web Components / custom elements:** each MFE ships a `<team-widget>` element the
  host drops onto the page.
- **iframes:** hard isolation, at the cost of UX (sizing, routing, shared state).
- **single-spa:** an orchestrator mounts/unmounts multiple framework apps on one
  page.
- **Pros:** true in-page composition; independent deploy of **widgets**, not just
  pages; can mix frameworks on one screen.
- **Cons:** much more complex (shared-dependency/version management, runtime
  failure handling, styling isolation, bundle duplication). Easy to over-engineer.

### 3. Server-side fragment composition

An edge/server layer stitches **HTML fragments** from several services into one
response (SSI, ESI, Tailor, Podium, Next.js Server Components across services in
theory). Between routing and runtime composition on the spectrum.

---

## So: is our project the "same concept" as Vercel Microfrontends?

**Yes.** Both are route/path-based composition. Differences are mechanical, not
conceptual:

| | Multi-Zones (ours) | Vercel Microfrontends |
|--|--------------------|------------------------|
| Routing config | `next.config` `rewrites()` in the shell | `microfrontends.json` group |
| Routing runs | Next server / Vercel rewrite | Vercel edge network |
| Asset isolation | per-zone `basePath` | auto asset prefix (`vc-ap-*`) |
| Local dev | shell proxies on `:3000` | `@vercel/microfrontends` proxy on `:3024` |
| Cost | free tier, any number of apps | Hobby group limited to 2 projects |
| Observability/UI | none (DIY) | Vercel dashboard + toolbar |

The **architecture** (bounded contexts, independent deploys, one origin, cookie
auth) is identical.

---

## What we deliberately did NOT build (and why)

We did **not** implement runtime/component composition (Module Federation etc.)
because:
- It's **over-engineering** for a multi-page admin portal — nothing here needs two
  apps' UI on the same screen.
- It adds shared-dependency versioning, runtime-failure handling, and style
  isolation problems that don't earn their keep at this scope.

**When you *would* reach for it:** a dashboard where independently deployed **widgets
from different teams** must live on one screen (e.g. a billing widget + an analytics
chart + a chat panel, each shipped on its own cadence). That's the canonical Module
Federation use case.

---

## Future extension (if you want to demonstrate runtime composition)

A minimal way to add the "other" concept on top of this project:

1. Add a **`widgets` app** (a fifth deployment) that exposes a remote component
   (e.g. a "Notifications" or "Video Player" widget) via **Module Federation**
   (`@module-federation/nextjs-mf`) or as a **Web Component**.
2. Have the **dashboard** page mount that remote widget **at runtime** — so one page
   renders UI owned by two independently deployed apps.
3. Handle the widget being **down** with a fallback boundary (isolated failure).

That single addition would let the project demonstrate **both** micro-frontend
concepts: route-based composition (the zones) **and** runtime component composition
(the remote widget).

---

## One-line answers for interviews

- **"Is Multi-Zones the same as Vercel Microfrontends?"** — Yes; both are path-based
  composition. Vercel manages the routing at the edge; Multi-Zones does it via
  `next.config` rewrites.
- **"What's the *other* kind of micro-frontend?"** — Runtime/component composition
  (Module Federation, Web Components, iframes): many micro-frontends on **one page**,
  vs. one whole app per route.
- **"Why didn't you use Module Federation here?"** — Nothing needs two apps' UI on
  the same page; route-based composition is simpler and sufficient. I'd add Module
  Federation only for independently deployed **widgets** sharing a screen.
