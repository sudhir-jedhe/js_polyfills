# Why does `next build` fail after adding `output: 'export'`?

```js
// next.config.js
module.exports = {
  output: 'export',
};
```

```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const session = cookies().get('session');
  const user = await getUserFromSession(session?.value);
  return <div>Welcome, {user.name}</div>;
}
```

The project built successfully before `output: 'export'` was added. After adding it, `next build` fails with an error about this route.

**Answer:** `app/dashboard/page.tsx` reads `cookies()`, which is inherently a **request-time** operation — cookies are per-visitor, sent with each individual HTTP request, and have no meaningful value at build time when there's no actual visitor or request to read from. Static export requires every page to be fully resolvable ahead of time with no server present at request time to compute anything dynamic, so any route that touches `cookies()`, `headers()`, `searchParams`, or does an uncached, request-scoped data fetch is fundamentally incompatible with `output: 'export'` and causes a build-time error rather than silently producing broken output.

**Why:** This is the practical, sharp edge of static export's constraint: it's not merely "slower without a server," it's a hard capability cutoff. There is no way to make this specific page work under static export while preserving its per-user personalization — the fixes are either (1) remove `output: 'export'` and deploy to a target that runs a Next.js server (Vercel, a Node.js host, a container), preserving full dynamic rendering, or (2) redesign the dashboard to be genuinely static (e.g., render a generic shell at build time and fetch the personalized data client-side after the page loads, via a separately-hosted API — accepting the UX tradeoff of a loading state for personalized content). There's no middle ground within static export itself; a project can't selectively keep one route dynamic while exporting the rest statically.
