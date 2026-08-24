# 03 — Server and Client Components

The Server/Client Component split is the architectural core of the App Router: components are Server Components by default (rendering on the server with zero client JS and direct backend access) unless explicitly marked `"use client"` for interactivity. This topic covers the default, the directive, the one hard composition rule (Server can import Client, not the reverse — with the children/props escape hatch), what you give up by over-using Client Components, and the serialization boundary that governs what data can cross from server to client.

## Key points

- Every file under `app/` is a Server Component by default; `"use client"` as the first line opts a module (and its import graph) into the client bundle.
- Server Components can `await` data directly, access databases/secrets, and ship no JS for their own logic; Client Components are required for hooks, event handlers, browser APIs, and Context consumption.
- `"use client"` does not disable server rendering — Client Components are still rendered to HTML for the initial response; the directive only controls hydration/interactivity.
- Server Components can import Client Components; Client Components cannot import Server Components directly — the workaround is passing already-rendered Server Component output as `children`/props.
- Marking everything `"use client"` costs bundle size, Time to Interactive, and direct backend access — push the boundary down to the smallest interactive leaf.
- Props crossing the Server-to-Client boundary must be serializable — no plain functions (Server Actions are the sanctioned exception via `'use server'`), no class instances, no refs.

## Index

### theory/
- `01-server-components-default.md` — the Server Component default and its consequences
- `02-client-components-use-client.md` — the `"use client"` directive and when it's required
- `03-composition-rules.md` — the import rule and the children/props workaround
- `04-cost-of-all-client-components.md` — bundle size, backend access, and streaming costs of over-using client components
- `05-serialization-boundary.md` — what data can and can't cross the Server-to-Client boundary

### snippets/
- `server-component-db-fetch.tsx` — direct database access in a Server Component
- `client-component-counter.tsx` — a minimal Client Component with state
- `interactive-island-composition.tsx` — mostly-server page with one client island
- `server-children-into-client-wrapper.tsx` — Server Component content passed as children into a Client wrapper
- `server-action-as-prop.tsx` — a Server Action passed as a prop, contrasted with a plain function
- `pushing-client-boundary-down.tsx` — before/after refactor narrowing the client boundary

### output-based/
- `01-function-prop-error.md` — passing a plain function as a prop throws
- `02-import-server-into-client.md` — importing a server-only module into a Client Component
- `03-context-in-server-component.md` — why `useContext` fails inside a Server Component
- `04-serializable-date-vs-class-instance.md` — `Date` survives the boundary, a class instance doesn't
- `05-third-party-client-lib-in-server-component.md` — an unmarked third-party client library breaking a server render
- `06-env-var-leak-risk.md` — non-`NEXT_PUBLIC_` secrets never reaching the client
- `07-use-client-directive-placement.md` — why the directive must be the first line

### scenarios/
- `01-dashboard-mostly-server-one-island.md` — converting a fully-client dashboard to server-rendered metrics plus one filter
- `02-fixing-function-prop-error.md` — diagnosing a teammate's CI failure from a plain function prop
- `03-shrinking-a-bloated-client-bundle.md` — removing an unnecessary blanket `"use client"` from a docs page
- `04-modal-needing-server-content.md` — composing a client-side modal shell with server-rendered content

### interview-qa/
- `01-fundamentals-qa.md` — defaults, capabilities, and hook restrictions
- `02-composition-and-boundary-qa.md` — the import rule, children pattern, and serialization
- `03-tradeoffs-and-practice-qa.md` — practical judgment on when and how to draw boundaries

### problems/
- `01-mostly-server-with-interactive-island.md` — build a page with correct server/client composition
- `02-demonstrate-and-fix-function-prop-error.md` — reproduce and fix the classic serialization error
- `03-refactor-push-boundary-down.md` — narrow an overly broad client boundary to a single leaf component

### assets/
- `README.md` — placeholder for original notes' images/PDFs
