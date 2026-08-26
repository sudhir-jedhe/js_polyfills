# Anti-Pattern: Marking a Whole Page `"use client"` Unnecessarily

This is the single most common App Router anti-pattern, and it's usually introduced innocently: a developer needs one small piece of interactivity (a dropdown, a like button, a form input) and reaches for `'use client'` at the top of the entire page file rather than isolating just the interactive piece. Full treatment of Server/Client boundaries is in topic 03; this is the anti-pattern-specific version.

## Before: the whole page opts into client rendering

```tsx
// app/products/[id]/page.tsx
'use client';

import { useState } from 'react';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  // Data fetching now has to happen client-side too, since Server
  // Component async/await patterns aren't available in a Client Component:
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then((r) => r.json()).then(setProduct);
  }, [params.id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <button onClick={() => addToCart(product.id, quantity)}>Add to Cart</button>
    </div>
  );
}
```

The consequence isn't just "unnecessary" — it's a cascade of real costs: the entire product description/name/every bit of static content now ships as client JS and re-renders on the client; data fetching is forced into a `useEffect`, introducing a loading spinner and a client-server round trip that wouldn't otherwise be needed (see the next anti-pattern file); and the component can no longer use server-only capabilities (direct database access, server-only secrets) without an intermediate API layer.

## After: isolate the client boundary to the interactive leaf

```tsx
// app/products/[id]/page.tsx (Server Component — no 'use client')
import { AddToCartForm } from './add-to-cart-form';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id); // direct server-side fetch, no client round trip

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartForm productId={product.id} />
    </div>
  );
}
```

```tsx
// app/products/[id]/add-to-cart-form.tsx
'use client';

import { useState } from 'react';

export function AddToCartForm({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <button onClick={() => addToCart(productId, quantity)}>Add to Cart</button>
    </div>
  );
}
```

Only `AddToCartForm`'s (small) JS ships to the client; the product name, description, and data fetch stay entirely server-side, rendered directly into the initial HTML with no loading state needed at all.

## The mental check to apply

Before adding `'use client'`, ask: what *specifically* needs interactivity, state, or a browser-only API here? Mark only that piece, as far down the tree as possible, and pass whatever server-fetched data it needs down as props (Server Components can render Client Components and pass serializable props to them, but not the reverse — a Client Component cannot import and directly render a Server Component as a child, though it can accept one via a `children`/prop slot passed down from a Server Component ancestor). Treat `'use client'` as a boundary you draw deliberately and narrowly, not a blanket fix for "this file uses `useState` somewhere."
