// lib/get-user.ts — shared fetch function used by multiple components
export async function getUser() {
  const res = await fetch('https://api.example.com/user/me')
  console.log('getUser() network call executed') // only logs ONCE per request
  return res.json()
}

// app/layout.tsx
import { getUser } from '@/lib/get-user'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser() // call site #1
  return (
    <html>
      <body>
        <header>Logged in as {user.name}</header>
        {children}
      </body>
    </html>
  )
}

// app/page.tsx
import { getUser } from '@/lib/get-user'

export default async function Page() {
  const user = await getUser() // call site #2 — deduped via Request Memoization
  return <p>Welcome back, {user.name}</p>
}

// During a single request, "getUser() network call executed" logs exactly once,
// even though getUser() is called from two different components in the tree.
