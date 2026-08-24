# Client Components and the `"use client"` Directive

`"use client"` at the top of a file marks that module (and everything it imports transitively, unless those imports are themselves separately marked or are pure server-safe utilities) as part of the **client bundle** — its code is sent to the browser and hydrated there, enabling interactivity.

```tsx
// app/components/Counter.tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Clicked {count} times
    </button>
  )
}
```

You need `"use client"` whenever a component uses:

- **React state/lifecycle hooks** — `useState`, `useReducer`, `useEffect`, `useLayoutEffect`.
- **Event handlers** — `onClick`, `onChange`, `onSubmit`, and so on; these require a live event loop in the browser.
- **Browser-only APIs** — `window`, `document`, `localStorage`, `navigator.geolocation`, `IntersectionObserver`, etc.
- **React Context consumption via `useContext`** (a Server Component cannot subscribe to a Context Provider's live value — Context is fundamentally a client-side runtime mechanism, though a Server Component *can* pass values as props into a Client Component that itself provides Context to further Client Component children).
- **Custom hooks that internally use any of the above** — the directive is "infectious" through the import chain from that point.

Importantly, `"use client"` does **not** mean "this component only renders in the browser." As covered in the rendering-strategies topic, Client Components are still rendered to HTML on the server for the initial page load (or at build time, if the route is otherwise static) — the directive controls where the component's *JavaScript* is bundled and where its *interactivity* is enabled, not whether an initial HTML render happens.

A common early mistake is marking a large section of the app `"use client"` — say, an entire page — because *one* small piece needs a click handler. This drags every component that page imports into the client bundle, even ones that don't need to be there, inflating JS payload for no benefit. The idiomatic pattern (covered in depth in the composition theory file) is to push `"use client"` as far down the tree as possible — onto the smallest leaf component that actually needs interactivity — and let everything else remain a Server Component by default.

```tsx
// app/products/[id]/page.tsx — stays a Server Component
import { AddToCartButton } from './AddToCartButton' // small client island

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```
