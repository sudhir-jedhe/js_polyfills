# Scenario: Migrating a Pages Router settings page to the App Router

**Problem:** A team is incrementally migrating from Pages Router to App Router, route by route (using Next.js's supported side-by-side migration approach). The next target is a settings page that currently uses `getServerSideProps` to fetch the current user's profile and preferences on every request (data that's per-user and must always be fresh — no caching).

```tsx
// Pages Router: pages/settings.tsx (before)
export async function getServerSideProps(context) {
  const sessionCookie = context.req.cookies.session;
  const user = await getUserFromSession(sessionCookie);
  if (!user) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: { user } };
}

export default function SettingsPage({ user }) {
  return <SettingsForm user={user} />;
}
```

**Approach:** Map `getServerSideProps`'s three responsibilities individually to their App Router equivalents: reading the request (cookies), an unconditional fresh fetch (no caching), and conditional redirect logic (`{ redirect: ... }`) becomes an explicit `redirect()` call.

```tsx
// App Router: app/settings/page.tsx (after)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SettingsForm } from './settings-form';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  const user = await getUserFromSession(sessionCookie); // no cache: 'no-store' needed --
  // this isn't a `fetch` call to an external URL in this example, it's a direct
  // server-side function call, which always runs fresh on every request by nature.

  if (!user) {
    redirect('/login');
  }

  return <SettingsForm user={user} />;
}
```

Three specific mapping decisions worth calling out: (1) `context.req.cookies` becomes the `cookies()` function from `next/headers`, awaited as of Next.js 15's async APIs; (2) the Pages Router's `{ redirect: { destination, permanent } }` return object becomes an explicit `redirect()` call from `next/navigation`, which throws internally to interrupt rendering — it must be called directly in the component body, not conditionally stored and returned like the old props-object pattern; (3) since `getUserFromSession` here is a direct async function call (not a `fetch` to an external HTTP endpoint), there's no `cache`/`next.revalidate` option to set at all — Server Component function calls are fresh by default unless explicitly wrapped in a caching mechanism like React's `cache()` or a `fetch` call with caching options. `SettingsForm` itself would only need `'use client'` if it has actual interactive/stateful form behavior, which is unaffected by this migration and stays exactly as it was.
