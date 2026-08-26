# Output: Build Error or Silent Bug?

```tsx
// app/lib/getUser.ts
import { db } from '@/lib/db'

export async function getUser(id: string) {
  return db.user.findUnique({ where: { id } })
}
```

```tsx
// app/UserCard.tsx
'use client'
import { useState } from 'react'
import { getUser } from './lib/getUser' // importing a server-only module

export function UserCard({ id }: { id: string }) {
  const [user, setUser] = useState(null)
  return (
    <div onClick={async () => setUser(await getUser(id))}>
      {user ? user.name : 'Click to load'}
    </div>
  )
}
```

What happens when you try to build/run this?

**Answer:** A build-time error — Next.js's bundler detects that `getUser.ts` uses server-only code (typically the database client itself will throw or be flagged if it imports something like `server-only`, or the bundler will attempt to include Node-only APIs in the client bundle and fail) — commonly surfacing as something like "You're importing a component that needs db which is a Node.js module... This module cannot be used in a Client Component." At minimum, this is a serious bug even if it doesn't hard-fail: attempting to bundle a database client (with connection strings, drivers relying on Node APIs like `fs`/`net`) for the browser either breaks the build or, worse, leaks server-only code/credentials into the client bundle.

**Why:** `getUser` isn't a Server Action (no `'use server'`), so importing it inside a `"use client"` file pulls its entire module — including its `db` import — into the client bundle graph. Server-only modules (database clients, filesystem access, code using secret env vars) are meant to execute exclusively on the server; they were never designed to run in a browser context, and many will throw immediately if bundled there (e.g., trying to open a TCP connection an ORM needs). The correct pattern is to keep `getUser` as a plain server function called *from* a Server Component (which then passes serializable data down as props to `UserCard`), or to expose it as a proper Server Action (`'use server'`) if it needs to be invoked directly from client-side event handlers, or to wrap it in a Route Handler if you want a conventional fetch-based API instead.
