# Server Components: The Default in the App Router

Every component under `app/` is a **Server Component** unless you explicitly opt out with `"use client"`. This is a fundamental shift from the React mental model most developers built up over the last decade, where every component eventually runs in the browser. Server Components render entirely on the server (or at build time for static routes) and — critically — **ship zero JavaScript to the client for that component's own code**. The browser receives the rendered HTML/RSC payload, not the component's source or logic.

```tsx
// app/products/page.tsx — a Server Component, no directive needed
import { db } from '@/lib/db'

export default async function ProductsPage() {
  // Direct database access — this code never runs in the browser,
  // so the connection string, query logic, and ORM never ship to the client.
  const products = await db.product.findMany({ take: 20 })

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} — ${p.price}</li>
      ))}
    </ul>
  )
}
```

Three consequences of this that matter in practice:

**Direct backend access.** Server Components can `await` a database query, read a file from disk, call an internal-only microservice, or use secret API keys directly in the component body — none of it needs to go through a public API route, because the component never executes in an untrusted environment (the browser). This collapses a whole category of Next.js code that used to require a separate `/api` endpoint just to keep credentials off the client.

**Zero client JS by default.** A page built entirely from Server Components ships essentially no framework runtime JS for its own logic — only what's needed for Next.js's core client-side navigation. This is a meaningful bundle-size win over a traditional SPA where every component's code (and its dependencies) gets bundled and sent to the browser regardless of whether it's interactive.

**`async`/`await` works directly in the component function.** There's no special data-fetching function to export — a Server Component can simply be an `async function`, `await` whatever it needs, and return JSX. React and Next.js handle streaming the result down as the data resolves.

The tradeoff is that Server Components **cannot** use browser-only APIs, React hooks that require client state (`useState`, `useEffect`, `useContext` outside of specific patterns), or event handlers (`onClick`, `onChange`) — none of that has meaning on the server, since there's no DOM and no interactivity loop. That's exactly the gap Client Components fill, covered in the next theory file. The core design principle to internalize: **default to Server Components, and only reach for `"use client"` when you hit something that genuinely requires the browser.**
