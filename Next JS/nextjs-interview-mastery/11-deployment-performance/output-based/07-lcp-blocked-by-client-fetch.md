# Why does the hero image on this page have a 2.8s LCP despite being a small, optimized file?

```tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [hero, setHero] = useState<{ imageUrl: string; headline: string } | null>(null);

  useEffect(() => {
    fetch('/api/hero-content')
      .then((res) => res.json())
      .then(setHero);
  }, []);

  if (!hero) return <div>Loading...</div>;

  return (
    <div>
      <Image src={hero.imageUrl} alt="" width={1200} height={600} priority />
      <h1>{hero.headline}</h1>
    </div>
  );
}
```

The image itself, once it loads, is small and served through `next/image`'s optimizer with `priority` set correctly. Lighthouse still reports a poor LCP score for this page.

**Answer:** `priority` and `next/image`'s optimization only help *once the browser knows the image URL and starts fetching it* — but here, the image URL isn't known until an entire client-side round trip completes: the browser has to download and parse the page's JS, hydrate the component, run the `useEffect`, wait for `fetch('/api/hero-content')` to resolve, and only then does `hero.imageUrl` exist for `<Image>` to even start requesting. The LCP element in this case is effectively gated behind a full client-render-then-fetch waterfall, and no amount of image-level optimization fixes a bottleneck that happens entirely *before* the image request is even issued.

**Why:** This is the same anti-pattern covered in topic 12 (Client Component fetching data in `useEffect` instead of a Server Component fetch) but viewed through the LCP lens specifically. The fix is to fetch `hero-content` server-side, in a Server Component, so the hero image's URL (and the resulting `<img>` tag) is present in the initial HTML the server sends — the browser can then discover and start fetching the actual image bytes immediately on document parse, in parallel with (not sequentially after) JS hydration:

```tsx
// app/page.tsx (Server Component)
import Image from 'next/image';

export default async function LandingPage() {
  const hero = await getHeroContent(); // server-side fetch, in the initial HTML
  return (
    <div>
      <Image src={hero.imageUrl} alt="" width={1200} height={600} priority />
      <h1>{hero.headline}</h1>
    </div>
  );
}
```

This single change collapses the "JS load → hydrate → client fetch → image request" chain into "server fetch → HTML with image already referenced → browser fetches image immediately," which is typically the difference between a multi-second LCP and one well under the 2.5s "good" threshold.
