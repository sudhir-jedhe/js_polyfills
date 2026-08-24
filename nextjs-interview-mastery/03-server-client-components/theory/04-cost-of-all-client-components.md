# What You Lose by Making Everything a Client Component

It's tempting, especially for teams migrating from a Pages Router or classic SPA mindset, to slap `"use client"` at the top of every page "just to be safe" and move on. This works — the app still functions — but it quietly gives up most of what the App Router's architecture is designed to provide.

**Bundle size.** Every Client Component's code, plus every library it imports, gets shipped to the browser and must be parsed, compiled, and executed before the page is interactive. A component tree that's entirely Client Components means the entire page's logic — including large dependencies like a markdown renderer, a charting library, or a date formatting utility — ends up in the client JS bundle even if 90% of that tree never needs to change after the initial render. Server Components render that same logic once, on the server, and send only the resulting HTML — the markdown parser, the charting library's rendering code, none of it needs to exist in the browser at all.

```tsx
// Bad: entire page is client, pulling a heavy library into the client bundle
'use client'
import { renderMarkdown } from 'heavy-markdown-lib' // now shipped to every browser

export default function ArticlePage({ raw }: { raw: string }) {
  return <div dangerouslySetInnerHTML={{ __html: renderMarkdown(raw) }} />
}
```

```tsx
// Good: markdown rendering happens on the server, never reaches the client bundle
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const raw = await getRawArticle(params.slug)
  const html = renderMarkdown(raw) // heavy-markdown-lib stays server-side
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

**No direct backend access.** A Client Component can't `await` a database query or use server-only secrets — it has to go through a public API (a Route Handler or Server Action), adding a network round-trip and requiring you to design and secure an endpoint you might not have otherwise needed. Marking everything client-side re-introduces this indirection everywhere, even for data that a Server Component could have fetched directly and cheaply.

**Slower Time to Interactive and weaker Core Web Vitals.** More JS means more parse/compile/execute time on the client before the page responds to input, which directly affects metrics like TTI and can indirectly hurt INP. Server Components sidestep this for any part of the UI that doesn't need client-side logic.

**Loss of streaming granularity.** Server Components integrate with React Suspense to stream in slower parts of a page independently — an all-client page loses this fine-grained, per-component streaming and instead behaves more like a monolithic client-rendered bundle that either shows a single loading state or nothing until everything resolves.

None of this means Client Components are bad — they're essential for interactivity — but the cost model matters: every `"use client"` boundary is a deliberate tradeoff of bundle size and server-access simplicity in exchange for browser-side capability, and it should be applied at the smallest scope that actually needs it, not defaulted to broadly.
