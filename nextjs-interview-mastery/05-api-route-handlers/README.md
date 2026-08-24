# 05 — API Route Handlers

Route Handlers are the App Router's replacement for `pages/api`: files named
`route.js` inside `app/` that export one async function per HTTP method
(`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, ...), working directly with the
standard Web `Request`/`Response` objects instead of Express-style `req`/`res`.
This topic also covers Server Actions — `"use server"` functions callable
directly from Client Components for same-app form mutations — and, critically,
when to reach for one over the other.

## Key takeaways

- A route segment maps 1:1 to `route.js`; the file's HTTP-method exports (not
  a single default export) determine what requests it handles. Unmatched
  methods auto-404/405 without you writing that logic.
- `route.js` and `page.js` cannot occupy the same segment — they'd both try to
  answer `GET` on the same URL.
- Everything is Web-standard: `request.json()`/`.formData()`/`.text()` are
  async and consume the body stream exactly once; you return a real
  `Response`/`NextResponse`, never leave a handler without a return value.
- Query params come from `request.nextUrl.searchParams`; cookies from
  `request.cookies` (read) or `next/headers`'s `cookies()` (read everywhere,
  write only in Route Handlers/Server Actions).
- A `GET` Route Handler that reads no dynamic input (no searchParams, cookies,
  headers) can be statically cached by Next.js in production — a frequent
  "why is my data stale" interview trap. `export const dynamic =
  'force-dynamic'` or `revalidate`/`revalidateTag` fix it explicitly.
- Server Actions (`"use server"`) let Client Components call server-only
  mutation logic without hand-writing a `fetch` call or a route file; they
  shine for same-app form submissions and pair naturally with
  `useFormState`/`useFormStatus` for field-level errors and pending UI.
- Rule of thumb: **external consumer (mobile app, webhook, third party) →
  Route Handler. Internal form/mutation with no external contract → Server
  Action.** Nothing stops both from sharing one underlying service function.

## Index

### theory/
1. `01-route-handlers-basics.md` — `route.js`, per-method exports, file-to-URL mapping, static vs. dynamic caching intro.
2. `02-request-response-web-apis.md` — Web `Request`/`Response` vs. Express `req`/`res`, `NextRequest`/`NextResponse` extras, Edge Runtime implications.
3. `03-reading-params-body-headers-cookies.md` — query params, body parsing by content type, headers, cookies read/write asymmetry, dynamic `params`.
4. `04-server-actions-as-alternative.md` — `"use server"`, calling actions from forms and event handlers, inline vs. shared action modules.
5. `05-route-handler-vs-server-action.md` — decision framework, comparison table, sharing logic between both.

### snippets/
1. `01-basic-get-post-route.js` — minimal GET list + POST create.
2. `02-dynamic-segment-route.js` — `[id]` param handling with 404s.
3. `03-reading-query-params.js` — `searchParams` parsing and validation.
4. `04-reading-headers-and-cookies.js` — auth cookie read + refreshed cookie write.
5. `05-server-action-form.jsx` — action + `useFormState`/`useFormStatus` client form.
6. `06-error-handling-and-status-codes.js` — try/catch pattern with correct status codes.
7. `07-force-dynamic-and-runtime.js` — `dynamic`/`runtime` route segment config.

### output-based/
1. `01-missing-return.md` — handler with no return value → 500.
2. `02-double-body-read.md` — reading the body stream twice → throws.
3. `03-page-and-route-conflict.md` — `page.jsx` + `route.js` same segment → build error.
4. `04-stale-cached-get.md` — GET silently statically cached in production.
5. `05-server-action-called-from-server-component.md` — inline action in a Server Component, no `"use client"` needed.
6. `06-wrong-status-for-not-found.md` — 200 with an error-shaped body defeats `res.ok`.
7. `07-cookies-set-in-server-component.md` — writing cookies during render throws.

### scenarios/
1. `01-public-api-for-mobile-app.md` — exposing a public product API alongside existing Server Actions.
2. `02-webhook-receiver.md` — Stripe webhook: raw body, signature verification, idempotency.
3. `03-form-with-field-level-errors.md` — signup form with per-field server-side errors via Server Action.
4. `04-protecting-admin-endpoint.md` — 401 vs. 403, cookie-based session validation.

### interview-qa/
1. `01-route-handler-fundamentals.md` — method dispatch, page/route conflicts, empty-body JSON parsing, `Response.json` vs `NextResponse.json`.
2. `02-server-actions-deep-dive.md` — what `"use server"` does, form vs. onClick invocation, serialization, revalidation.
3. `03-choosing-the-right-tool.md` — cross-app reuse, when a Route Handler still makes sense for same-app work, one-sentence heuristic.

### problems/
1. `01-crud-route-handler.md` — GET/POST for a `books` resource with manual validation and correct status codes.
2. `02-server-action-field-errors.md` — `createEvent` Server Action returning multi-field validation errors.
3. `03-cookie-auth-route-handler.md` — cookie-based auth with distinct 401 cases, plus a login route that sets the cookie.

### projects/
- `mini-notes-api/` — a real runnable Next.js app: `app/api/notes/route.js`
  (GET/POST) and `app/api/notes/[id]/route.js` (GET/PUT/DELETE) backed by an
  in-memory store in `lib/notes-store.js`. Includes `package.json` and its own
  README with curl examples for every endpoint.

### assets/
- `README.md` — placeholder pointing to the original notes source map.
