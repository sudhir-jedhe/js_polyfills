# Scenario: Locking Down an Admin-Only Route Handler

`/api/admin/export` streams a CSV of all user data. It must only be callable by authenticated users with an `admin` role, and must reject everyone else with the correct status — `401` for "not logged in" versus `403` for "logged in but not authorized," since the frontend team wants to distinguish "please log in" from "you don't have permission" in the UI.

**Approach:**

```js
// app/api/admin/export/route.js
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  const token = cookies().get('session')?.value;

  if (!token) {
    return Response.json({ error: 'Authentication required' }, { status: 401 });
  }

  const session = await getSession(token);
  if (!session) {
    // token present but invalid/expired — still a 401, not logged in successfully
    return Response.json({ error: 'Session invalid or expired' }, { status: 401 });
  }

  if (session.user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const csv = await generateUserExportCsv();

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users-export.csv"',
    },
  });
}

export const dynamic = 'force-dynamic'; // depends on cookies(), never cache
```

Points to raise:

1. **401 vs. 403 distinction**: 401 means "who are you?" (missing or invalid credentials); 403 means "I know who you are, and you're not allowed." Collapsing both into one status code is a common sloppy mistake that breaks frontend logic like "redirect to /login on 401, show an access-denied page on 403."
2. **Session validation, not just cookie presence**: a cookie existing doesn't mean it's valid — always resolve it against a session store/JWT verification, not just a truthy check.
3. **`dynamic = 'force-dynamic'`** is technically automatic here anyway (reading `cookies()` already opts the route out of static caching), but declaring it explicitly documents intent for future maintainers.
4. **Never leak whether the user exists** in error messages for auth failures on sensitive endpoints — keep messages generic enough not to aid enumeration attacks, while still being useful enough for legitimate debugging.
