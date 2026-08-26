# Problem 3: Fix a broken `useSearchParams` usage

## Task

The following code is reported as failing `next build` (or, depending on surrounding structure, silently forcing an entire page to render client-side when it was meant to stay statically rendered). Diagnose and fix it.

## Buggy code

```tsx
// app/search/page.tsx (Server Component -- no 'use client' here)
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div>
      <h1>Search Results</h1>
      <p>Showing results for: {query}</p>
      <StaticFooter />
    </div>
  );
}

function StaticFooter() {
  return <footer>© 2026 Example Co.</footer>;
}
```

## Requirements for the fix

1. Identify BOTH problems in the code above (there are two independent issues, not one).
2. Isolate the `useSearchParams` usage into the smallest possible Client Component, rather than converting the whole page.
3. Wrap that Client Component in a `<Suspense>` boundary with a sensible fallback.
4. Ensure `StaticFooter` (and the rest of the page) remains a Server Component, unaffected by the fix — it should not need `'use client'`.

## Self-check

- Does `SearchPage` itself remain a Server Component (no `'use client'` at its top)?
- Is `useSearchParams()` called only inside a dedicated small Client Component?
- Is that component wrapped in `<Suspense>` with a fallback that renders something reasonable (not just `null`, ideally similar in shape to avoid layout shift)?
- Does `next build` succeed without the missing-Suspense-boundary error?
