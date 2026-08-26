// app/products/[id]/page.tsx — Server Component (default, no directive)
import { AddToCartButton } from './AddToCartButton'

async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      {/* The only interactive island on this page */}
      <AddToCartButton productId={product.id} />
    </div>
  )
}

// app/products/[id]/AddToCartButton.tsx — the sole Client Component
;('use client')

import { useState } from 'react'

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)

  return (
    <button
      onClick={() => {
        setAdded(true)
        // POST to a cart API, etc.
      }}
    >
      {added ? 'Added ✓' : 'Add to cart'}
    </button>
  )
}
