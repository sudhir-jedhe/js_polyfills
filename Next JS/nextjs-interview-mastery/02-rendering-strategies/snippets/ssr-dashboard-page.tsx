// app/dashboard/page.tsx
// SSR / forced dynamic: cookies() is a dynamic function, so Next.js
// renders this route fresh on every request instead of statically.

import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const sessionId = cookies().get('session_id')?.value

  const res = await fetch(`https://api.example.com/me`, {
    headers: { Authorization: `Bearer ${sessionId}` },
    cache: 'no-store', // explicit, though cookies() already forces dynamic
  })
  const user = await res.json()

  return <h1>Welcome back, {user.name}</h1>
}
