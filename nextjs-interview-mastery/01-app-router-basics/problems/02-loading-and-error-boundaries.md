# Problem 2: Implement `loading.js` and `error.js`

## Task

You have a route `app/products/[id]/page.tsx` that fetches product details from an API which is sometimes slow (2-3 seconds) and sometimes fails (simulate with a random throw). Implement:

1. `loading.tsx` for this segment showing a skeleton.
2. `error.tsx` for this segment showing a friendly error message with a "Try again" button.
3. Explain, in a comment, exactly when each one activates.

## Solution

```tsx
// app/products/[id]/page.tsx
async function getProduct(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000)) // simulate latency

  if (Math.random() < 0.3) {
    throw new Error('Failed to fetch product details')
  }

  return { id, name: `Product ${id}`, price: 29.99 }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  )
}
```

```tsx
// app/products/[id]/loading.tsx
export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="skeleton-title" />
      <div className="skeleton-price" />
    </div>
  )
}
```

```tsx
// app/products/[id]/error.tsx
'use client'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div role="alert">
      <h2>We couldn't load this product</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

**When each activates:**
- `loading.tsx` activates the moment the user navigates to `/products/[id]` and `getProduct`'s `await` is still pending — it's the Suspense fallback for that segment, shown automatically without any manual `<Suspense>` wiring.
- `error.tsx` activates only if `getProduct` throws during rendering — it's a Client Component error boundary that catches the thrown error, replaces the segment's content with the fallback UI, and gives the user a `reset()` function that re-attempts rendering the segment (effectively retriggering `page.tsx`, which will show `loading.tsx` again while `getProduct` re-runs).
- The two never show simultaneously — a given render attempt is either pending (`loading.tsx`), failed (`error.tsx`), or succeeded (the real page content).
