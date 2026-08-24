# Scenario: Auditing a `.env` setup after a security-conscious hire joins the team

**Problem:** A new senior engineer joins a small team and, on their first week, asks to review the `.env.production` file as a standard onboarding security check. They find a mix of genuinely public config and sensitive credentials, inconsistently prefixed — some secrets accidentally exposed, and some genuinely public values needlessly kept server-only (which isn't a security bug, but does force unnecessary server round-trips for values that could be inlined at build time).

```bash
# .env.production (before audit)
NEXT_PUBLIC_APP_NAME=Acme Dashboard
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_51H...        # BUG: secret key, publicly exposed
SENDGRID_API_KEY=SG.abc123...                        # correctly server-only
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/123      # fine -- DSNs are meant to be public
APP_ENVIRONMENT_LABEL=production                       # could be NEXT_PUBLIC_ if used client-side for a banner
DATABASE_URL=postgres://user:pass@host/db              # correctly server-only
```

**Approach:** Classify every variable by two questions: (1) does client-side code genuinely need this value, and (2) is it safe for it to be public if it is. Only variables that are "yes" to both should carry the `NEXT_PUBLIC_` prefix.

```bash
# .env.production (after audit)
NEXT_PUBLIC_APP_NAME=Acme Dashboard
STRIPE_SECRET_KEY=sk_live_51H...          # prefix removed; server-only from now on
SENDGRID_API_KEY=SG.abc123...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/123
NEXT_PUBLIC_APP_ENVIRONMENT_LABEL=production  # now correctly public, if a client banner needs it
DATABASE_URL=postgres://user:pass@host/db
```

Fixing `STRIPE_SECRET_KEY`'s prefix is necessary but not sufficient — because it was previously public, it must be treated as compromised: rotate the key in Stripe's dashboard, update the new value only as the non-prefixed server-only variable, and redeploy. The engineer also grep's the codebase for any remaining direct references to `process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY` in Client Components to confirm nothing breaks once the value is no longer available client-side (any code that was reading the secret key from the client should never have existed in the first place — the fact that it worked at all is itself evidence of the underlying architectural problem, since secret keys should only ever be used server-side to call Stripe's API directly, never passed to the client for any reason).
