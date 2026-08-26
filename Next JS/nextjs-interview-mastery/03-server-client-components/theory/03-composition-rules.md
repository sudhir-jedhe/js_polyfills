# The Composition Rule: Server Can Import Client, Not the Reverse

There's exactly one hard rule governing how Server and Client Components combine: **Server Components can import and render Client Components, but Client Components cannot import Server Components directly.**

The reason is mechanical, not arbitrary. Once you're inside a Client Component's module graph, everything imported from that point on gets bundled for the browser — but a Server Component's code (database calls, secret env vars, server-only imports) fundamentally cannot execute in the browser. If Next.js allowed a plain `import { ServerThing } from './ServerThing'` inside a `"use client"` file, it would either have to bundle `ServerThing`'s server-only code into the client bundle (a security/functionality disaster) or silently fail — so it's disallowed outright, and bundlers will error or produce broken behavior if you try.

```tsx
// This DOES work — Server Component importing a Client Component
// app/page.tsx (Server Component, default)
import { LikeButton } from './LikeButton' // Client Component

export default async function Page() {
  const post = await getPost()
  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton postId={post.id} />
    </article>
  )
}
```

```tsx
// This DOES NOT work as a direct import
// app/LikeButton.tsx
'use client'
import { getPost } from './data' // ❌ if data.ts is server-only (e.g., touches a DB)

export function LikeButton() { /* ... */ }
```

The escape hatch, when a Client Component genuinely needs a Server Component to appear somewhere inside it, is the **"pass Server Components as children/props" pattern**. Because JSX children are just values, a Server Component can render a Client Component and pass *already-rendered* Server Component output as `children` — the Client Component never imports the Server Component's module, it just receives already-resolved JSX to place wherever it wants in its own output.

```tsx
// app/ClientWrapper.tsx
'use client'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button onClick={() => setExpanded((e) => !e)}>Toggle</button>
      {expanded && children /* Server Component content, passed in from the parent */}
    </div>
  )
}
```

```tsx
// app/page.tsx — Server Component composing the two
import { ClientWrapper } from './ClientWrapper'
import { ServerRenderedComments } from './ServerRenderedComments' // Server Component

export default async function Page() {
  return (
    <ClientWrapper>
      <ServerRenderedComments /> {/* rendered on the server, passed as children */}
    </ClientWrapper>
  )
}
```

This works because `page.tsx` — a Server Component — is the one doing the importing and rendering of `ServerRenderedComments`; `ClientWrapper` only ever sees the *result* (a React element / already-rendered tree) via its `children` prop, never the module itself. This pattern is exactly how things like layout wrappers, modals, and tab containers that need client-side interactivity (open/closed state, animation) can still host server-rendered content inside them without violating the import rule.
