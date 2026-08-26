# Problem 2: Demonstrate and Fix the Function-Prop Error

## Task

First, write code that reproduces the "functions cannot be passed directly to Client Components" error: a Server Component passing a plain (non-Server-Action) async function to a Client Component as a prop. Then fix it properly using a Server Action.

## Step 1 — Reproduce the error

```tsx
// app/newsletter/page.tsx — Server Component
import { SubscribeForm } from './SubscribeForm'
import { db } from '@/lib/db'

// ❌ Plain async function, no 'use server' — this is the bug
async function subscribe(email: string) {
  await db.subscriber.create({ data: { email } })
}

export default function NewsletterPage() {
  return <SubscribeForm onSubscribe={subscribe} />
}
```

```tsx
// app/newsletter/SubscribeForm.tsx
'use client'
import { useState } from 'react'

export function SubscribeForm({ onSubscribe }: { onSubscribe: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState('')

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await onSubscribe(email)
      }}
    >
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Subscribe</button>
    </form>
  )
}
```

Running this build throws: `Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".` — because `subscribe` is a plain server-side function being passed as a prop across the serialization boundary, and functions have no serializable representation unless explicitly marked as Server Actions.

## Step 2 — Fix with a Server Action

```tsx
// app/newsletter/actions.ts
'use server'

import { db } from '@/lib/db'

export async function subscribe(email: string) {
  await db.subscriber.create({ data: { email } })
}
```

```tsx
// app/newsletter/page.tsx — fixed
import { SubscribeForm } from './SubscribeForm'
import { subscribe } from './actions'

export default function NewsletterPage() {
  return <SubscribeForm onSubscribe={subscribe} /> // ✅ Server Action reference, serializes fine
}
```

`SubscribeForm` itself doesn't need to change at all — the type signature `(email: string) => Promise<void>` still matches. What changed is that `subscribe` is now a Server Action: Next.js serializes a reference to it (not its code), and calling `onSubscribe(email)` from the client triggers a real network request back to the server, where `subscribe` actually executes with direct database access. This is the general fix pattern any time you hit this specific error: move the function into a module with (or add inline) `'use server'`.
