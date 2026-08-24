## Why does this throw at runtime?

```jsx
// app/profile/page.jsx (Server Component)
import { cookies } from 'next/headers';

export default async function ProfilePage() {
  const cookieStore = cookies();
  cookieStore.set('lastVisited', new Date().toISOString()); // <-- throws

  const user = await getUser(cookieStore.get('session')?.value);
  return <div>Welcome, {user.name}</div>;
}
```

**Answer:** This throws an error at request time: `Error: Cookies can only be modified in a Server Action or Route Handler`. Reading `cookieStore.get(...)` above is fine; the `.set(...)` call is what fails.

**Why:** Server Components render into static-ish HTML as part of a response that may be cached, streamed, or reused across requests — there's no reliable single "outgoing response" moment during render where a `Set-Cookie` header could be safely attached without breaking caching semantics or producing inconsistent results across concurrent renders. Route Handlers and Server Actions, by contrast, each correspond to exactly one real HTTP response/mutation, so setting cookies on them is well-defined. The fix is to move the cookie-writing logic into a Server Action (triggered by user interaction) or a Route Handler, and keep the Server Component strictly read-only with respect to cookies:

```js
'use server';
import { cookies } from 'next/headers';

export async function recordVisit() {
  cookies().set('lastVisited', new Date().toISOString());
}
```
