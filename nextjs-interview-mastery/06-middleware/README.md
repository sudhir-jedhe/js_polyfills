# 06 — Middleware

`middleware.js` at the project root runs before Next.js finishes resolving a
request to a page, layout, or Route Handler. It executes on the **Edge
Runtime** by default — a Web-API-only environment, not Node.js — and the
`matcher` config controls which routes actually trigger it. This topic covers
auth gating, rewrites for A/B testing and locale routing, response header
injection, and the performance discipline required because middleware runs on
every matched request.

## Key takeaways

- Middleware is a single exported function per project — there's no
  Express-style chained middleware stack; compose multiple checks yourself
  inside that one function.
- Default runtime is Edge: no `fs`, no Node-only DB drivers, no Node `crypto`
  module — only `fetch`, Web Crypto, `URL`, and other Web-standard APIs. Code
  that assumes Node's stdlib will fail to build or throw.
- `config.matcher` scopes execution before the function even runs — cheaper
  and more self-documenting than relying solely on in-function
  `pathname.startsWith(...)` checks. Wildcards (`:path*`, `:path+`) are
  required to cover nested routes; an exact path only matches that exact path.
- `NextResponse.redirect()` sends the browser a real 3xx and changes the URL
  bar; `NextResponse.rewrite()` serves different content while the visible
  URL stays exactly what the user requested. Mixing these up is a very common
  and very visible bug (URL-bar leaks for A/B tests, or auth-gate content
  silently swapped without redirecting).
- Because middleware runs on every matched request, avoid unbounded DB calls
  or slow external fetches inside it — verify a signed cookie/JWT locally
  instead of hitting a database, and always attach a timeout/fallback to any
  external call you do make.
- Every code path must explicitly return a `NextResponse` — an implicit
  `undefined` return silently behaves like "let the request through," which
  is a dangerous, easy-to-miss failure mode for security-relevant checks.

## Index

### theory/
1. `01-middleware-basics-and-placement.md` — file location, per-project single function, `NextResponse.next/redirect/rewrite` overview.
2. `02-edge-runtime-implications.md` — what Edge Runtime does and doesn't provide, Node API incompatibilities.
3. `03-matcher-config.md` — matcher syntax, wildcards, negative-lookahead exclusion pattern.
4. `04-redirect-rewrite-next.md` — precise semantics and use cases for each `NextResponse` method.
5. `05-performance-and-common-use-cases.md` — why middleware must stay fast, canonical use cases.

### snippets/
1. `01-basic-middleware-skeleton.js` — minimal pass-through middleware with logging.
2. `02-auth-redirect.js` — session cookie check + redirect to `/login`.
3. `03-ab-test-rewrite.js` — bucket assignment cookie + rewrite for A/B testing.
4. `04-locale-rewrite.js` — `Accept-Language` parsing + locale rewrite.
5. `05-security-headers.js` — CSP and other headers on every response.
6. `06-composing-multiple-checks.js` — combining auth + header logic in one function.

### output-based/
1. `01-fs-import-in-middleware.md` — Node `fs` import fails on Edge Runtime.
2. `02-redirect-loop.md` — matcher/logic doesn't exclude the redirect target → infinite loop.
3. `03-matcher-doesnt-match-nested.md` — exact-path matcher silently misses nested routes.
4. `04-rewrite-vs-redirect-confusion.md` — using redirect where rewrite was intended, breaking analytics.
5. `05-header-set-on-request-not-response.md` — mutating `request.headers` directly does nothing; correct pattern via `NextResponse.next({ request: { headers } })`.
6. `06-missing-return-value.md` — a "blocking" branch with no return silently allows the request through.
7. `07-cookie-write-in-middleware-vs-response.md` — the correct pattern for setting cookies via `response.cookies.set()`.

### scenarios/
1. `01-multi-tenant-subdomain-routing.md` — rewriting subdomain requests onto an internal dynamic route.
2. `02-role-based-route-protection.md` — layered auth/role/plan checks with distinct redirect destinations via JWT.
3. `03-maintenance-mode-toggle.md` — instant sitewide maintenance mode via edge-config + rewrite, with fail-open behavior.

### interview-qa/
1. `01-runtime-and-execution-model.md` — Edge Runtime constraints, execution timing, DB access limitations.
2. `02-matcher-and-routing-decisions.md` — matcher vs. in-function checks, redirect vs. rewrite, wildcard gaps.
3. `03-performance-and-anti-patterns.md` — why per-request cost compounds, DB lookup anti-pattern, rate-limiting justification, silent no-op bug.

### problems/
1. `01-auth-gate-dashboard.md` — session-cookie auth gate for `/dashboard/:path*` with `from` redirect param.
2. `02-locale-detection-rewrite.md` — `Accept-Language`-based locale rewrite with double-prefix protection.
3. `03-security-headers-middleware.md` — CSP and standard security headers applied globally, excluding `/api`.

### assets/
- `README.md` — placeholder pointing to the original notes source map.

No `projects/` folder for this topic — the assignment scopes middleware to
theory/snippets/problems rather than a standalone runnable app.
