# Interview Q&A: Navigation Hooks

**Q: What's the difference between `router.push` and `router.replace`?**
A: `push` adds a new entry to the browser history stack, so the back button returns to the previous page. `replace` overwrites the current history entry instead of adding a new one, so the back button skips over it entirely. Use `replace` for navigation that shouldn't be a "revisitable" step — post-login redirects, one-time interstitials, onboarding steps the user completed.

**Q: Why do `usePathname` and `useSearchParams` require a Client Component, when a Server Component page already receives `params`/`searchParams` as props?**
A: The props on a Server Component page reflect the URL *at the time that specific render happened on the server*. `usePathname`/`useSearchParams` are hooks that read *live, client-side* router state and re-render their component whenever navigation changes it — that's a stateful, subscription-based mechanism that only makes sense in the browser, inside the client component tree, not during a one-shot server render.

**Q: What additional requirement does `useSearchParams` have that `usePathname` doesn't?**
A: A Suspense boundary. Using `useSearchParams` in a component that's part of an otherwise statically-rendered page requires wrapping that component (or an ancestor) in `<Suspense>`, so Next.js can stream a fallback for the query-string-dependent part while serving the rest of the page from the static shell. `usePathname` has no equivalent requirement since it doesn't represent request-time-only data the same way.

**Q: When would you reach for `router.refresh()` instead of `router.push()`?**
A: When you need to re-fetch a Server Component's data for the *current* route after a mutation, without changing the URL and without losing client-side state elsewhere on the page (open modals, scroll position, form inputs in sibling components). `router.push` to the same URL isn't guaranteed to trigger a fresh server fetch since the destination is unchanged from the router's perspective; `router.refresh()` is the explicit, guaranteed invalidation call.
