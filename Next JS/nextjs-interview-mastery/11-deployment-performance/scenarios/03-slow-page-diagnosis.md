# Scenario: Diagnosing a slow page using the rendering-strategy decision framework

**Problem:** A product listing page (`/products`) is reported as "slow" in a bug ticket, with no further detail. Real User Monitoring shows LCP around 3.4s (poor) and INP occasionally spiking above 300ms during interaction. The page currently looks like this:

```tsx
'use client';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  return <ProductGrid products={products} />;
}
```

**Approach:** Apply the rendering-strategy decision framework from topic 02: is this content the same for every visitor (yes — it's a product catalog, not personalized), does it need to reflect very recent data (not second-by-second — periodic revalidation is fine), and is it currently client-fetched when it doesn't need to be (yes — this is the core problem). The whole page is marked `'use client'` and fetches data in a `useEffect` after mount, which means: the browser has to download the JS bundle, parse and execute it, hydrate the component, run the effect, wait for the fetch to resolve, and only then render real content — the largest content on the page (the product grid) can't paint until that entire chain completes, directly explaining the poor LCP. The unnecessary client-wide `'use client'` boundary also means more JS ships and hydrates than needed, contributing to the INP spikes during early interaction.

```tsx
// app/products/page.tsx (Server Component, statically generated + revalidated)
export const revalidate = 300; // catalog data refreshes every 5 minutes

async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 300 },
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />; // rendered server-side, in the initial HTML
}
```

Converting this to a Server Component with a cached `fetch` moves the data-fetch to the server, where it can run in parallel with (or ahead of) the client bundle download rather than strictly after it, and the resulting HTML already contains the full product grid — the browser has real content to paint immediately, without waiting on any client-side JS execution at all. Interactive pieces that genuinely need client state (an "add to cart" button, a wishlist toggle) remain small, targeted Client Components nested inside this otherwise-server-rendered page, keeping the client JS payload — and therefore INP risk — minimal.
