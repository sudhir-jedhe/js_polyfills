# Suspense and the fallback Prop

A lazily-loaded component isn't ready synchronously — it's still being fetched over the network the first time it's rendered. `Suspense` lets you declare what to show while it's not ready:

```jsx
<Suspense fallback={<Spinner />}>
  <SettingsPanel />
</Suspense>
```

Suspense works by catching the "not ready yet" signal (a thrown promise) from a lazy component and rendering `fallback` until that promise resolves, then re-rendering with the real component. `fallback` is shown for *any* descendant instance of "not ready," not just the immediate child — Suspense boundaries catch from anywhere below them in the tree, similar to how error boundaries catch from anywhere below them.

`fallback` can be any valid JSX — a spinner, a skeleton screen, `null` — React doesn't impose special constraints on it beyond being a valid element.

## Where to put your Suspense boundaries

You can wrap a single lazy component tightly, or wrap a whole subtree with one boundary shared by several lazy components:

```jsx
// Tight: each component gets its own loading state, staggered
<Suspense fallback={<Spinner />}><Header /></Suspense>
<Suspense fallback={<Spinner />}><Sidebar /></Suspense>

// Shared: everything waits together, one loading state
<Suspense fallback={<PageSpinner />}>
  <Header />
  <Sidebar />
</Suspense>
```

Neither is universally correct:

- **Granular boundaries** avoid an all-or-nothing blocking wait but can produce layout jank as pieces pop in independently.
- **A single shared boundary** gives a cleaner "whole section arrives at once" feel but blocks on the slowest piece — the fallback stays visible until *every* suspending descendant in that subtree is ready.

Use nested boundaries for genuinely independent, differently-paced sections (main content vs. a comments panel); use one boundary for pieces that should visually appear as a single unit.

| Aspect | Single shared boundary | Multiple nested boundaries |
|---|---|---|
| Loading behavior | Everything waits for the slowest child, then reveals together | Each subtree reveals independently as soon as it's ready |
| Visual result | Clean, unified "whole section pops in" | Can feel more responsive, but risks layout shift as pieces arrive at different times |
| Complexity | Simpler to reason about and write | More boundaries to place and think through |
| Common mistake | Wrapping the entire app in one boundary, making a single slow widget block everything | Over-nesting boundaries around trivially fast components, adding no benefit and just complexity |

## What happens if you forget the boundary entirely

React throws an error at render time telling you a suspended component was rendered outside of a `Suspense` boundary — there's no silent fallback behavior. A boundary is required somewhere in the ancestor chain for `React.lazy` to work.
