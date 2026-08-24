# Output: Does the Whole App Crash?

```
app/
  layout.tsx
  dashboard/
    error.tsx
    layout.tsx
    reports/
      page.tsx    <- throws during render
  settings/
    page.tsx      <- unaffected route
```

While the user is on `/dashboard/reports` and it throws, what happens to (a) `/dashboard/reports` itself, (b) the dashboard layout (e.g. its nav bar), (c) a `/settings` tab open in another browser tab?

**Answer:** (a) The reports content is replaced by `dashboard/error.tsx`'s fallback UI. (b) The dashboard layout keeps rendering normally — the nav bar stays visible and interactive. (c) The `/settings` tab is completely unaffected; it's a separate render tree in a separate request/session.

**Why:** `error.tsx` creates a React error boundary scoped to its own segment and everything nested below it — it does not wrap the layout.tsx that sits in the *same* folder as it. Next.js's implicit nesting places `error.tsx` *inside* the corresponding `layout.tsx`, wrapping only `page.tsx` (and deeper segments), so a thrown error is caught before it bubbles up and unmounts the dashboard shell. If there were no `error.tsx` at `dashboard/`, the error would bubble to the nearest ancestor `error.tsx` (or `app/global-error.tsx` if none exists), potentially taking down more of the UI — which is exactly why placing error boundaries at meaningful segment granularity matters. `/settings` in another tab is a fully independent render, unrelated to a client-rendering exception in the reports segment.
