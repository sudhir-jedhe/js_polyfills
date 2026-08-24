# Why doesn't the modal ever appear?

```
app/
  feed/
    page.tsx           <- links to /photo/[id]
    layout.tsx          <- does NOT declare a `modal` slot prop
  photo/
    [id]/
      page.tsx
  (.)photo/
    [id]/
      page.tsx           <- intended as the intercepted modal view
```

The developer clicks a photo thumbnail inside `/feed`, expecting a modal to open. Instead, the browser does a full navigation straight to the regular `/photo/[id]` page every time.

**Answer:** The intercepted route is never rendered because `(.)photo/[id]/page.tsx` was placed at the **app root**, sibling to `feed/`, instead of *inside* `feed/` as a parallel-route slot (e.g., `app/feed/@modal/(.)photo/[id]/page.tsx`). An intercepting route convention only has an effect when it's nested inside a **parallel route slot** that an ancestor layout actually renders — without a `@modal` slot declared and wired into `feed/layout.tsx`, there's nowhere for the intercepted content to render into, so Next.js falls back to normal routing.

**Why:** Intercepting routes and parallel routes are two separate mechanisms that are almost always used *together* for the modal pattern, and it's easy to implement one without correctly wiring the other. The full requirement list: (1) a `@modal` slot folder under `feed/`, (2) `feed/layout.tsx` accepting and rendering a `modal` prop, (3) a `default.tsx` in `@modal` so other routes under `feed` don't 404 when the slot has nothing to render, and (4) the `(.)photo/[id]/page.tsx` living *inside* `@modal`, matching the depth of the segment it intercepts (`(.)` intercepts at the same level as the folder containing it — since `@modal` lives directly under `feed/`, and the target `photo/[id]` also lives directly under `app/`, single-dot is correct here because slots don't count as an extra level of URL nesting). Missing any one of these four pieces silently degrades to plain full-page navigation, with no error thrown — which is exactly what makes this bug hard to spot without knowing the full convention.
