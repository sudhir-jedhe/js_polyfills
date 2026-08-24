# Problem 2: Audit a `.env` setup and fix an exposed secret

## Task

Given the following `.env.production` file and a snippet of code that consumes it, find and fix the security bug.

```bash
# .env.production
NEXT_PUBLIC_APP_NAME=Acme Analytics
NEXT_PUBLIC_MAILCHIMP_API_KEY=abc123-us21
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
DATABASE_URL=postgres://user:pass@host/db
```

```tsx
// app/api/subscribe/route.ts
export async function POST(request: Request) {
  const { email } = await request.json();

  const res = await fetch(
    `https://us21.api.mailchimp.com/3.0/lists/abc123/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY}`,
      },
      body: JSON.stringify({ email_address: email, status: 'subscribed' }),
    }
  );
  return Response.json(await res.json());
}
```

## Requirements

1. Identify which variable is misclassified and explain the concrete consequence of it being exposed (Mailchimp API keys grant broad account access — subscribing/unsubscribing lists, exporting subscriber data, etc.).
2. Fix the `.env` file: correct the variable's naming so it's server-only.
3. Update the Route Handler to reference the corrected variable name.
4. State explicitly, in a comment, whether removing the prefix alone is sufficient to remediate the issue, and what additional step (if any) is required given the key was already exposed in a previous deploy.
5. Explain why `NEXT_PUBLIC_APP_NAME` and `NEXT_PUBLIC_SENTRY_DSN` do NOT need to change.

## Self-check

- Does the corrected `.env` file expose only genuinely public values?
- Does the Route Handler still function correctly after the rename (correct variable name referenced)?
- Is the key-rotation requirement explicitly called out, not just the prefix fix?
