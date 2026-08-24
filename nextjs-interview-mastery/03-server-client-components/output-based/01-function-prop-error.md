# Output: Does This Throw?

```tsx
// app/page.tsx — Server Component
import { RefreshButton } from './RefreshButton'

async function refreshData() {
  await fetch('https://api.example.com/refresh', { method: 'POST' })
  console.log('refreshed')
}

export default async function Page() {
  return <RefreshButton onRefresh={refreshData} />
}
```

```tsx
// app/RefreshButton.tsx
'use client'

export function RefreshButton({ onRefresh }: { onRefresh: () => Promise<void> }) {
  return <button onClick={() => onRefresh()}>Refresh</button>
}
```

Does this compile and run correctly?

**Answer:** No — this throws a runtime error at build/render time, something like: "Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with `'use server'`."

**Why:** `refreshData` is a plain server-side async function, not a Server Action. Props passed from a Server Component to a Client Component must cross a serialization boundary — React needs to encode them into the RSC payload sent to the client, and a plain JavaScript function has no meaningful serializable representation (its closure, scope, and code can't just be shipped to the browser as data). Server Actions are the one exception: when a function is explicitly marked with the `'use server'` directive (either inline or at the top of its module), Next.js encodes it as a reference/ID instead of trying to serialize its implementation, and invoking it from the client triggers a network call back to the server to run the real function there. Without that directive, `refreshData` is just an ordinary function, and passing it as a prop violates the serialization boundary — the fix is adding `'use server'` as the first line of the function body (or the module), turning it into a proper Server Action.
