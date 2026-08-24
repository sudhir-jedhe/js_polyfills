# Interview Q&A: Context vs External State Libraries

**Q: Is Context a replacement for a state management library like Redux?**

No, not fully. Context is a dependency-injection mechanism for passing a value down the tree — it has no built-in selectors, middleware, devtools, or fine-grained subscription model. For infrequently-changing, broadly-shared data (auth, theme, locale) it's often sufficient on its own. For state that updates frequently and is read selectively by many components, a store with selector-based subscriptions (Redux, Zustand, Jotai) avoids the "every consumer re-renders" cost that plain Context has.

## Comparison table

| Aspect | Context API | Redux / Zustand |
|---|---|---|
| Subscription granularity | Coarse — any value change re-renders all consumers | Fine-grained — selectors subscribe components only to the slice of state they read |
| Built-in tooling | None (no devtools, no middleware) out of the box | Devtools, middleware, time-travel debugging typically available |
| Setup overhead | Zero dependencies, built into React | Extra dependency, more boilerplate (though Zustand is minimal) |
| Best for | Low-frequency-update, broadly-read data (theme, auth, i18n) | High-frequency updates, complex state graphs, many components needing selective subscriptions |

Use Context for infrequently changing, widely shared data. Reach for an external store when state updates frequently and is read selectively by many components. The most common mistake is using Context as a full app-wide state manager for frequently changing data (e.g., form state, real-time data) and then fighting re-render performance instead of reaching for a selector-based store.
