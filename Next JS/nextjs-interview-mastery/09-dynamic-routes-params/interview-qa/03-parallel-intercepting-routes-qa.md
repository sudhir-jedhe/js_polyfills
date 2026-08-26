# Interview Q&A: Parallel Routes and Intercepting Routes

**Q: What problem do parallel routes (`@slot`) solve that a normal nested layout can't?**
A: They let a single layout render multiple independently-routable sections simultaneously, each with its own loading/error boundaries and navigation state, without one section's route change affecting another's. A dashboard with a `@team` panel and an `@analytics` panel can navigate/reload one panel without disturbing the other — a plain nested route tree can't express "two independent sub-routes rendered side by side" because normal routing only resolves to one `children` tree at a time.

**Q: What is `default.tsx` for in a parallel route slot, and what happens if you omit it?**
A: It's the fallback UI a slot renders when the current URL doesn't match anything inside that slot. Without it, navigating (or hard-refreshing) to a URL the slot can't match results in a 404 for the entire layout, not just that slot — because Next.js has no fallback content to render into the unmatched slot.

**Q: What do the `(.)`, `(..)`, and `(...)` prefixes on an intercepting route mean?**
A: They describe how many levels up from the interceptor's own folder the *target* route being intercepted lives: `(.)` matches a target at the same level, `(..)` one level up, `(..)(..)` two levels up, and `(...)` matches from the root of the `app` directory regardless of the interceptor's nesting depth.

**Q: Does an intercepting route change what URL appears in the address bar?**
A: No — that's the point. The URL always reflects the "real" target route (e.g., `/photo/123`), whether it was reached via interception (rendering a modal) or via direct navigation (rendering the full page). This is what makes the pattern shareable and refresh-safe: the same URL, resolved differently depending on navigation origin, not two different URLs for "modal" and "full page" versions of the same content.

**Q: Why do the photo-modal pattern's routes need BOTH a parallel route slot and an intercepting route — wouldn't the interceptor alone be enough?**
A: The interceptor decides *when* to render the modal variant instead of the full page, but it needs somewhere to render *into* that doesn't replace the underlying page — that's the parallel slot's job. Without the slot, "intercepting" the navigation would just swap out the entire feed page for the modal content, losing the feed underneath, which defeats the purpose of an overlay.
