# Output: Is This Page SSR, SSG, or CSR?

```tsx
// app/counter/page.tsx
'use client'
import { useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}
```

A developer marks the entire page `"use client"` and argues: "this is a CSR page, so Next.js won't generate any HTML for it ahead of time — it's a blank shell that gets filled in by the browser, just like a classic React SPA." Is this accurate?

**Answer:** Not quite. Even though `CounterPage` is a Client Component, Next.js still **server-renders it to static HTML** (at build time here, since nothing forces it dynamic) for the initial response — the user gets a fully-formed `<div><p>Count: 0</p><button>Increment</button></div>` in the initial HTML, not a blank shell. What "use client" actually controls is that this component's *JavaScript* ships to the browser and hydrates, enabling the `onClick` handler and subsequent `count` updates to work.

**Why:** `"use client"` is a boundary marker for where client-side interactivity/hydration begins — it does not mean "skip server rendering." Next.js (via React Server Components + streaming SSR) still renders Client Components to HTML on the server for the initial page load, exactly as it would render Server Components, and sends that HTML down first. The client-side JS bundle for `CounterPage` then hydrates that existing markup, attaching event listeners and taking over for subsequent interaction — it doesn't re-render from scratch in the browser. This is different from a traditional pure-CSR SPA (e.g., a Create React App bundle mounting into an empty `<div id="root">`), where literally nothing is in the initial HTML. In the App Router, "CSR" in the sense used elsewhere in this topic really refers to data being *fetched and rendered client-side after mount* (via `useEffect`, polling, etc.), not to the presence of `"use client"` itself — a `"use client"` component with no client-side data fetching, like this counter, still benefits fully from server-rendered initial HTML.
