# Scenario: A Modal Needs Server-Fetched Content, but Modals Are Inherently Client-Side

Your team is building a "Quick View" product modal — clicking a product card opens a modal (open/close state, escape-key handling, focus trapping, all client-side concerns) showing full product details, reviews, and related items, all of which come from your database and would ideally be Server Component-rendered for direct data access and zero extra client JS.

The naive approach — making the whole modal, including the data-fetching content inside it, a Client Component that calls a `/api/products/[id]` route on open — works but means writing and maintaining a parallel API route just to re-expose data a Server Component could fetch directly, plus a loading spinner while that client-side fetch resolves.

**Approach:** Use the "pass Server Components as children" composition pattern. The modal shell (open/close state, keyboard handling, backdrop click) is a Client Component, but the actual product detail content inside it is rendered by a Server Component and passed in as `children` — no API route needed, and no client-side fetch/loading state for the content itself.

```tsx
// app/products/[id]/@modal/QuickViewModal.tsx — Client Component: shell only
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function QuickViewModal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') router.back()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [router])

  return (
    <div className="modal-backdrop" onClick={() => router.back()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
```

```tsx
// app/products/[id]/@modal/(.)quick-view/page.tsx — Server Component: content
import { QuickViewModal } from '../QuickViewModal'
import { getProduct, getReviews, getRelated } from '@/lib/products'

export default async function QuickViewPage({ params }: { params: { id: string } }) {
  const [product, reviews, related] = await Promise.all([
    getProduct(params.id),
    getReviews(params.id),
    getRelated(params.id),
  ])

  return (
    <QuickViewModal>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <ReviewsList reviews={reviews} />
      <RelatedProducts items={related} />
    </QuickViewModal>
  )
}
```

`QuickViewModal` never imports `getProduct`/`getReviews`/`getRelated` — it only imports `useRouter`/`useEffect`, so it stays a small, focused Client Component. The Server Component (`QuickViewPage`, using an intercepting route here for the "modal over the current page" UX, though the same composition works without intercepting routes too) does all the data fetching and passes the fully-rendered result in as `children`. This gets you the best of both: real client-side modal behavior (keyboard handling, focus, animation) and zero-client-JS data fetching for the content, with no API route required to bridge the gap.
