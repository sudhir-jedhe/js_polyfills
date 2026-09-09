***  04-context-vs-external-state.md ***

# Context vs external state libraries

Context is built into React and is great for low-frequency-update, broadly-needed data: theme, locale, authenticated user, feature flags. It is not a full state management solution — it has no selectors, no fine-grained subscriptions, no middleware, and no devtools out of the box. For high-frequency updates (e.g., a value changing on every keystroke or every animation frame) consumed by many components, an external store (Redux, Zustand, Jotai) that supports selector-based subscriptions will avoid the "everyone re-renders" problem entirely.

| Aspect | Context API | Redux / Zustand |
|---|---|---|
| Subscription granularity | Coarse — any value change re-renders all consumers | Fine-grained — selectors subscribe components only to the slice of state they read |
| Built-in tooling | None (no devtools, no middleware) out of the box | Devtools, middleware, time-travel debugging typically available |
| Setup overhead | Zero dependencies, built into React | Extra dependency, more boilerplate (though Zustand is minimal) |
| Best for | Low-frequency-update, broadly-read data (theme, auth, i18n) | High-frequency updates, complex state graphs, many components needing selective subscriptions |

## Context vs prop drilling

| Aspect | Prop drilling | Context |
|---|---|---|
| Explicitness | Every intermediate component's props show the data flow | Data flow is implicit — you have to search for the Provider to know where a value comes from |
| Refactoring cost | Adding/removing a consumer deep in the tree requires touching every intermediate component | Add `useContext` anywhere below the Provider, no intermediate changes needed |
| Re-render behavior | Only components that actually receive the changed prop re-render (if intermediates are memoized) | Every consumer re-renders on value change, regardless of intermediate memoization |

Use prop drilling for data that only travels 1-3 levels — it's more explicit and traceable. Reach for Context when the same value is needed by many components scattered at different, unpredictable depths.
