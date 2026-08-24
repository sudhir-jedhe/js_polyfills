# What happens when this builds for production?

```tsx
// app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return <div>Results for: {query}</div>;
}
```

This is the entire `page.tsx` file — `'use client'` is at the top, and there's no `<Suspense>` anywhere. Does `next build` succeed?

**Answer:** This specific case actually **does build successfully** — but it silently forces the *entire page* into a fully client-side-rendered, non-statically-prerendered route (Next.js will note in the build output that the route is rendered dynamically / opts out of static generation). The danger isn't a hard build error here; it's the *next* refactor: the moment a teammate wraps this page's content with a shared layout that expects static children, or extracts part of this component into something the build tries to statically optimize, they'll hit the actual "missing Suspense boundary" build error, and the fix will be non-obvious because the original file looked fine in isolation.

**Why:** When an entire route is a Client Component with no static shell above it, Next.js has nothing to statically prerender in the first place, so there's no boundary mismatch to complain about — the whole thing is dynamic by construction. The real rule that catches people is: **a Client Component using `useSearchParams` needs a Suspense boundary specifically when it's a child of an otherwise statically-rendered tree** (a Server Component page that doesn't itself opt into full dynamic rendering). The safest habit, regardless of whether a given page currently triggers the error, is to *always* isolate `useSearchParams` usage into a small leaf Client Component and wrap it in `<Suspense>` — it costs nothing when unnecessary and prevents a build break the next time the surrounding structure changes.
