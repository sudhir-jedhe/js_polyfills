# Why does this page take noticeably longer to show data than the network tab's individual request times suggest?

```tsx
'use client';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/user').then((r) => r.json()).then(setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/stats?userId=${user.id}`).then((r) => r.json()).then(setStats);
  }, [user]);

  if (!user || !stats) return <div>Loading...</div>;
  return <Dashboard user={user} stats={stats} />;
}
```

Each individual request in the network tab shows ~150ms. But the "Loading..." state persists for over 500ms before anything renders.

**Answer:** The two fetches aren't happening in parallel — they're a **waterfall**: the second `useEffect` explicitly depends on `user` being set before it even starts (`if (!user) return`), so `/api/stats` doesn't begin until *after* `/api/user` finishes, resolves, triggers a re-render, and the second effect re-runs. On top of the two ~150ms requests running sequentially rather than concurrently, there's also the initial cost of downloading/parsing/hydrating this component's JS before either `useEffect` can even fire — none of which shows up as an individual "slow" request in the network tab, since each request in isolation genuinely is fast; the problem is entirely in how they're sequenced and when they're allowed to start.

**Why:** This is a structural consequence of chaining client-side effects where one's trigger depends on another's result, and it's easy to introduce without noticing because each `useEffect` looks reasonable on its own. Two fixes, in order of preference: (1) move both fetches server-side into the page component itself, where they can be issued concurrently with `Promise.all` (or as two independently-streamed Suspense boundaries) — eliminating the client-side round trip entirely for data that's known at render time; or, if `stats` genuinely can't be fetched until `user.id` is known client-side for some legitimate client-only reason, at minimum restructure to avoid the *unnecessary* serialization — e.g., if the user ID is already available from a server-rendered prop or a URL param, both requests could start in parallel immediately rather than one gating the other.
