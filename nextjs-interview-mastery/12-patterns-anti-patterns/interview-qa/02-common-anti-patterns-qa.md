# Interview Q&A: Common Anti-Patterns

**Q: What's the concrete cost of marking a whole page `'use client'` when only one small part needs interactivity?**
A: Every component in that page's subtree ships as client JS (rather than rendering server-side with zero client bundle cost), the page loses access to Server-Component-only patterns like direct async data fetching and server-only secrets, and any data fetching has to move into `useEffect`, introducing a loading state and a client-server round trip that wouldn't otherwise be necessary.

**Q: Why is fetching data in a `useEffect` inside a Client Component often worse than a Server Component fetch, even for the exact same data?**
A: The client-side version requires downloading and executing the component's JS before the fetch can even start, always shows a loading state (even when the data would have been ready instantly server-side), and ships the fetch/loading/error-handling logic itself as part of the client bundle. A Server Component fetch happens before any HTML reaches the browser, so the data is already present in the initial render with no client round trip or loading UI required.

**Q: Give a case where `useEffect`-based client fetching is still the correct choice.**
A: When the data genuinely depends on a client-only capability not available during server rendering (geolocation, `localStorage`, `window` dimensions), or when it's fetched in direct response to a client-only interaction (autocomplete-as-you-type, a live-polling dashboard metric). The distinguishing question is whether the data exists and matters before any user interaction — if so, it belongs in a Server Component.

**Q: Why is putting real business logic (a database write, an external API call) inside middleware a problem, even if it technically works?**
A: Middleware runs on the Edge Runtime for every matching request, before routing resolves — it's meant for fast, lightweight decisions (auth checks, redirects, header manipulation). Heavier logic there couples it to Edge Runtime constraints (limited npm/Node compatibility), can silently slow down every request matching the middleware's path pattern, and is harder to test in isolation than an ordinary Route Handler.

**Q: What's the actual mechanism by which missing `loading.tsx`/`error.tsx` files hurt a project, beyond "it's less polished"?**
A: Without `loading.tsx`, a slow data fetch shows nothing until it fully resolves — no visual feedback, reading to users as a frozen or broken app. Without `error.tsx`, an unhandled render error propagates to the nearest ancestor Error Boundary — with none defined anywhere, that's effectively the root of the app, so a failure in one small feature can crash the entire shared shell instead of being contained to just that route segment.
