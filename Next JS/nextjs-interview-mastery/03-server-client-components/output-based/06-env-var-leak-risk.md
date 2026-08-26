# Output: Does the Secret Leak to the Browser?

```tsx
// .env.local
STRIPE_SECRET_KEY=sk_live_abc123
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xyz789
```

```tsx
// app/checkout/page.tsx — Server Component
export default async function CheckoutPage() {
  const secret = process.env.STRIPE_SECRET_KEY
  const charge = await createCharge(secret, { amount: 4999 })
  return <ConfirmationClient chargeId={charge.id} />
}
```

```tsx
// app/checkout/ConfirmationClient.tsx
'use client'
export function ConfirmationClient({ chargeId }: { chargeId: string }) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  return <p>Charge {chargeId} confirmed. Key prefix: {publishableKey?.slice(0, 6)}</p>
}
```

Does `STRIPE_SECRET_KEY` ever reach the browser? Does `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`?

**Answer:** `STRIPE_SECRET_KEY` never reaches the browser — it's read inside `CheckoutPage`, a Server Component, and only the resulting `chargeId` (a plain string) is passed across the boundary to the Client Component. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` does reach the browser and is visible in the client bundle/dev tools — by design.

**Why:** Environment variables without the `NEXT_PUBLIC_` prefix are only available server-side — Next.js's build process doesn't inline them into client bundles at all, so even if you tried to reference `process.env.STRIPE_SECRET_KEY` directly inside a `"use client"` file, it would simply evaluate to `undefined` in the browser (the variable is stripped, not passed through). This is a deliberate safety mechanism, separate from and in addition to the Server/Client Component serialization boundary discussed elsewhere in this topic — it protects against secrets leaking even if a developer mistakenly references them from client code. Variables prefixed with `NEXT_PUBLIC_` are explicitly opted into client bundling at build time — Next.js inlines their literal values into the JS sent to the browser, which is appropriate only for genuinely public values like a Stripe *publishable* key (not the secret key), a public analytics ID, or a public API base URL. The general rule: never prefix a secret with `NEXT_PUBLIC_`, and never try to pass a non-prefixed secret through a Client Component prop either — always resolve secret-dependent logic entirely within Server Components/Server Actions/Route Handlers and only pass the safe, derived result down.
