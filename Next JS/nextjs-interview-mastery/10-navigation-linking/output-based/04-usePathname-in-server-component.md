# Why does this throw at build/runtime?

```tsx
// app/nav.tsx -- no 'use client' directive
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav>
      <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
    </nav>
  );
}
```

`Nav` is imported directly into `app/layout.tsx`, which has no `'use client'` directive of its own either.

**Answer:** This throws an error at build/render time (something like *"You're importing a component that needs `usePathname`. This React hook only works in a Client Component..."*). Because neither `Nav` nor its importer (`layout.tsx`) declares `'use client'`, `Nav` is treated as a Server Component by default, and `usePathname` has no meaning on the server — there's no client-side router instance to read from during server rendering, since "the current pathname" client-side is a stateful, interactive concept tied to the browser's navigation, not something that exists during a server render pass.

**Why:** Every component in the App Router is a Server Component **by default** unless it (or a file that imports it, transitively, up the tree until a boundary is hit) has `'use client'` at the top. This is one of the most common early mistakes: assuming that because a component uses a "React hook," it's automatically a Client Component — the directive has to be added explicitly. The fix is a single line: add `'use client';` as the very first line of `app/nav.tsx`. Note this doesn't force `layout.tsx` itself to become a Client Component — the boundary is drawn exactly at `Nav`, and everything else in the layout that doesn't depend on client-only hooks can remain a Server Component, keeping the client JS bundle smaller than if the whole layout were marked `'use client'` defensively.
