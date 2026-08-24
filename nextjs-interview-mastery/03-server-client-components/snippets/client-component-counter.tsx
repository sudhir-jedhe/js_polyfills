// app/components/Counter.tsx
// Client Component: needs useState + onClick, both browser-only concepts.
'use client'

import { useState } from 'react'

export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial)

  return (
    <div>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  )
}
