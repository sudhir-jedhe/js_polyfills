# Problem 2: Refactor a client-fetch component into a Server Component

## Task

Refactor the following Client Component so its data fetching happens server-side instead, and describe the conceptual client bundle size difference before and after.

```tsx
'use client';
import { useState, useEffect } from 'react';

export function TeamMembersList({ teamId }: { teamId: string }) {
  const [members, setMembers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetch(`/api/teams/${teamId}/members`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load team members');
        return res.json();
      })
      .then(setMembers)
      .catch((err) => setError(err.message));
  }, [teamId]);

  if (error) return <p>Error: {error}</p>;
  if (!members) return <p>Loading members...</p>;

  return (
    <ul>
      {members.map((m: { id: string; name: string; role: string }) => (
        <li key={m.id}>{m.name} — {m.role}</li>
      ))}
    </ul>
  );
}
```

## Requirements

1. Convert `TeamMembersList` into an `async` Server Component (no directive needed) that fetches directly via `await fetch(...)`.
2. Move error handling to a thrown error, letting the nearest `error.tsx` boundary handle it, rather than component-level `error` state — explain in a comment why this is the more idiomatic App Router pattern.
3. Choose and justify a `revalidate` value for the fetch, given that team membership changes occasionally but not continuously.
4. In a comment, describe conceptually what disappears from the client bundle after this refactor (state management code, fetch logic, error-handling logic) versus what would remain if this component still had some genuinely interactive piece (e.g., a "remove member" button) — and where that piece should live if added.

## Self-check

- Does the refactored component contain zero `useState`/`useEffect` calls?
- Is there no `'use client'` directive anywhere in the refactored file?
- Does a fetch failure propagate as a thrown error rather than being caught and stored in local state?
- Is the `revalidate` value justified with a one-sentence rationale, not just picked arbitrarily?
