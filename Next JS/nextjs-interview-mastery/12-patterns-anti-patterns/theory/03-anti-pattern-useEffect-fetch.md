# Anti-Pattern: Fetching Data in `useEffect` When a Server Component Could Fetch It

Client-side data fetching inside `useEffect` was the default pattern for years (it's still the norm in the Pages Router, and in any client-only React app). In the App Router, reaching for it out of habit for data that's known at render time is almost always the wrong default.

## Before: client-side fetch-on-mount

```tsx
'use client';

import { useState, useEffect } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <ProfileSkeleton />;
  return <ProfileCard user={user} />;
}
```

This pattern has a stacking set of costs: (1) the browser has to download and parse this component's JS before the fetch can even start, meaning the fetch happens *after* a full round trip that a server-side fetch wouldn't need; (2) there's an unavoidable loading state, even for data that would have been ready instantly server-side; (3) the fetch logic, loading state, and error handling all ship as client JS; (4) if this component is one of several on a page each independently fetching in their own `useEffect`, you get a "waterfall" or at best uncoordinated parallel client requests, each adding its own round-trip tax, instead of the requests being resolved together during a single server render pass.

## After: Server Component fetch

```tsx
// app/users/[id]/profile.tsx (Server Component)
export async function UserProfile({ userId }: { userId: string }) {
  const user = await fetch(`https://api.example.com/users/${userId}`, {
    next: { revalidate: 60 },
  }).then((res) => res.json());

  return <ProfileCard user={user} />;
}
```

The fetch happens server-side, before any HTML is sent to the browser — by the time the client receives the page, `ProfileCard` is already rendered with real data, no loading skeleton required (unless the *page itself* is slow to render overall, in which case a route-level `loading.tsx` with Suspense streaming is the correct tool, not a component-level client fetch).

## When `useEffect` fetching is still the right call

This isn't "never fetch client-side" — it's "don't default to it for data that's available at render time." Legitimate client-fetch cases remain: data that depends on a client-only browser API not available server-side (geolocation, `localStorage`), data that needs to poll/refresh on an interval while the user stays on the page (a live dashboard metric), or data fetched in response to a client-side-only interaction (an autocomplete search-as-you-type). The distinguishing question: does this data exist and matter *before* the user interacts with anything, or is it fundamentally a response to something that only happens in the browser? The former belongs in a Server Component; the latter is legitimately a `useEffect` (or better, a dedicated data-fetching library like SWR/React Query) use case.

## Measuring the difference

Refactoring a `useEffect`-fetching Client Component into a Server Component fetch typically removes the fetch/loading/error-state logic entirely from the client bundle (that code now runs only on the server), shrinking the JS shipped for that piece of UI to roughly whatever's left for actual interactivity — often a meaningful fraction of the original component's bundle contribution, and in cases where the component had no remaining interactive parts at all, the client bundle contribution drops to zero.
