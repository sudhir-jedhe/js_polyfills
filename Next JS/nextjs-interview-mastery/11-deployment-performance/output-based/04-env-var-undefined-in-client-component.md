# What does this render, and why doesn't it throw?

```bash
# .env.local
API_SECRET_KEY=abc123
```

```tsx
'use client';

export function DebugPanel() {
  return <div>Secret: {process.env.API_SECRET_KEY}</div>;
}
```

A developer expects either the secret value to appear (bad, but at least explainable) or an error to be thrown (safe failure). Instead, the page renders `Secret: ` with nothing after the colon — not even the literal string `"undefined"`.

**Answer:** `process.env.API_SECRET_KEY` evaluates to `undefined` inside this Client Component, because Next.js only inlines environment variables into the client bundle when they're prefixed with `NEXT_PUBLIC_` — everything else is simply not present in client-side code at all, not even as a redacted placeholder. React renders `undefined` as literally nothing (no text node), which is why the output is `Secret: ` with a trailing blank rather than `Secret: undefined` as a string.

**Why:** This is actually the *safe* failure mode working exactly as designed — the absence of the value, rather than a thrown error, is what prevents developers from being alerted loudly to the mistake, which is precisely why this class of bug is easy to ship unnoticed if you're not specifically checking for it. A developer debugging "why is my secret not showing up" might be tempted to "fix" this by adding the `NEXT_PUBLIC_` prefix — which would make the value *appear*, but by actually leaking it into the client bundle, turning a confusing-but-safe bug into a genuine security incident. The correct fix, if this value is genuinely needed client-side for legitimate purposes (which a "secret key" almost certainly isn't), is to expose only a purpose-specific, non-sensitive derived value via a real `NEXT_PUBLIC_` variable — never the raw secret itself. If the value is only needed for server-side logic, the correct fix is simply moving the code that uses it into a Server Component or Route Handler.
