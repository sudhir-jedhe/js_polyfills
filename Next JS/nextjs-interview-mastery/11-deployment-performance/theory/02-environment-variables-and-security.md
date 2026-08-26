# Environment Variables: `NEXT_PUBLIC_` and the Security Boundary

Next.js draws a hard line between environment variables available only on the server and those exposed to the browser, and the mechanism for crossing that line — a naming prefix — is small enough to type wrong, which makes it one of the most consequential footguns in the framework.

## Server-only by default

```bash
# .env.local
DATABASE_URL=postgres://user:pass@host/db
STRIPE_SECRET_KEY=sk_live_abc123
```

```tsx
// app/api/checkout/route.ts (Route Handler, server-only)
export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // fine -- server only
  // ...
}
```

Any environment variable **without** the `NEXT_PUBLIC_` prefix is only readable in server-side code — Route Handlers, Server Components, Server Actions, `middleware.ts`, `next.config.js`. Referencing it inside code that ends up in a Client Component's bundle simply resolves to `undefined` at runtime (Next.js's build step strips/inlines env vars, and non-prefixed ones aren't inlined into client bundles at all) — this is a deliberate safety mechanism, not an oversight.

## Explicitly public: `NEXT_PUBLIC_`

```bash
# .env.local
NEXT_PUBLIC_ANALYTICS_ID=UA-12345
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

```tsx
'use client';
export function AnalyticsScript() {
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID; // works -- inlined at build time
  // ...
}
```

Variables with this prefix are **inlined directly into the client-side JavaScript bundle at build time** — literally baked into the compiled output as string literals. This means: (1) they're visible to anyone who opens browser devtools and reads the bundle, no exceptions, and (2) changing one requires a full rebuild — you can't update a `NEXT_PUBLIC_` value at runtime via a `.env` change on a running server, since it was already compiled into static JS.

## The security implication of forgetting the distinction

```bash
# WRONG -- accidentally exposes a secret to every visitor's browser
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_abc123
```

The moment a genuinely secret value (an API secret key, a database connection string, a signing secret, a third-party service credential) is given a `NEXT_PUBLIC_` prefix — even by a copy-paste mistake, or a search-and-replace that added the prefix to an entire block of variables — it ships to every visitor's browser in plain text as part of the JS bundle. There's no server-side gate at that point; it's just public data, indistinguishable from a client-side stylesheet reference. This isn't a subtle timing bug — it's an immediate, total leak the instant the affected code is deployed, and rotating the leaked credential afterward is mandatory (removing the prefix and redeploying does **not** retroactively protect a key that was already shipped in a previous build, since anyone could have already scraped it).

## Practical safeguards

- Treat the naming convention as load-bearing, not cosmetic: never bulk-rename or template `.env` files in a way that could accidentally add `NEXT_PUBLIC_` to a secret.
- Keep genuinely public config (feature flags meant for client logic, publishable/publishable-by-design API keys like Stripe's *publishable* key — which is safe by design, unlike the *secret* key) clearly separated in `.env` files from anything server-only, ideally with a naming or file-grouping convention that makes the split visually obvious during review.
- In code review, treat any new `NEXT_PUBLIC_` variable as a question worth asking explicitly: "is this genuinely meant to be public?" rather than assuming the prefix was applied correctly.
