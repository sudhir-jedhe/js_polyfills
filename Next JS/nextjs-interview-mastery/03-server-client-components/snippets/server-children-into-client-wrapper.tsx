// app/ClientWrapper.tsx — Client Component that hosts Server Component content
'use client'

import { useState } from 'react'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button onClick={() => setExpanded((e) => !e)}>
        {expanded ? 'Hide comments' : 'Show comments'}
      </button>
      {expanded && children}
    </div>
  )
}

// app/page.tsx — Server Component doing the actual importing of ServerComments
import { ClientWrapper } from './ClientWrapper'
import { ServerComments } from './ServerComments' // Server Component

export default async function Page() {
  return (
    <ClientWrapper>
      <ServerComments /> {/* rendered server-side, passed as children — no import inside ClientWrapper */}
    </ClientWrapper>
  )
}

// app/ServerComments.tsx — plain Server Component, direct DB access is fine
async function getComments() {
  return fetch('https://api.example.com/comments').then((r) => r.json())
}

export async function ServerComments() {
  const comments = await getComments()
  return <ul>{comments.map((c: { id: string; text: string }) => <li key={c.id}>{c.text}</li>)}</ul>
}
