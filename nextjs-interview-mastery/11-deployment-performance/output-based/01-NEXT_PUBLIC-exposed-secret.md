# A security review flags this `.env` file. What's wrong?

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51H...
NEXT_PUBLIC_INTERNAL_ADMIN_TOKEN=sk_admin_9f8a7b6c5d4e...
DATABASE_URL=postgres://user:pass@host/db
```

```tsx
'use client';
export function AdminPanel() {
  const token = process.env.NEXT_PUBLIC_INTERNAL_ADMIN_TOKEN;
  return <button onClick={() => callAdminApi(token)}>Sync Data</button>;
}
```

**Answer:** `NEXT_PUBLIC_INTERNAL_ADMIN_TOKEN` is the bug — an internal admin token, which should grant privileged server-to-server access, has been given the `NEXT_PUBLIC_` prefix and is therefore compiled directly into the client-side JavaScript bundle shipped to every visitor's browser. Anyone can open devtools, view the bundle source, and extract this token — it requires no exploit, no authentication bypass, just reading publicly-served JS. The `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` lines are fine — a base URL and a Stripe *publishable* key (as opposed to the *secret* key) are both designed to be public by their very nature.

**Why:** The fix has two parts, and doing only the first one is insufficient. First, remove the `NEXT_PUBLIC_` prefix and access the token only from server-side code (a Route Handler that proxies the admin action, never exposing the token to the client at all — the `AdminPanel` component should call an internal API route, not the external admin API directly with an embedded token). Second, and critically, **rotate the token** — simply removing the prefix and redeploying does not undo the exposure, because the token was already shipped in every previous build's bundle, potentially cached by CDNs, scraped by bots, or saved by anyone who inspected the page before the fix went out. Any leaked secret must be treated as permanently compromised the moment it's confirmed to have been client-exposed, regardless of how quickly the code is corrected afterward.
