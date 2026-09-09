***  01-mechanics-and-prop-drilling.md ***

# Interview Q&A: Mechanics & Prop Drilling

**Q: What problem does the Context API solve?**

Prop drilling — passing data through many layers of components that don't themselves need the data, just to get it to a deeply nested consumer. Context lets any component below a `Provider` read a value directly via `useContext`, without every intermediate component having to accept and forward a prop.

**Q: Walk through the three pieces of using Context.**

`createContext(defaultValue)` creates a context object. `<MyContext.Provider value={...}>` wraps part of the tree and supplies the current value to all descendants. `useContext(MyContext)` reads that value from the nearest enclosing Provider, or falls back to the `defaultValue` if there's no Provider above it in the tree.

**Q: What does `createContext` return, and what does its argument mean?**

It returns a context object with `.Provider` and `.Consumer` properties (the class-style `.Consumer` render-prop API still exists but `useContext` is preferred in function components). The argument is the default value, used only when a consuming component has no matching `Provider` anywhere above it in the tree — not a fallback used when the Provider's value happens to be falsy.

**Q: Can you have multiple Providers for the same context nested inside each other?**

Yes — a consumer reads from the *nearest* Provider above it in the tree. This lets you override a context's value for a specific subtree, e.g. a nested "preview mode" section that provides a different theme value than the rest of the app, without affecting siblings outside that subtree.

## Comparison table: prop drilling vs Context

| Aspect | Prop drilling | Context |
|---|---|---|
| Explicitness | Every intermediate component's props show the data flow | Data flow is implicit — you have to search for the Provider to know where a value comes from |
| Refactoring cost | Adding/removing a consumer deep in the tree requires touching every intermediate component | Add `useContext` anywhere below the Provider, no intermediate changes needed |
| Re-render behavior | Only components that actually receive the changed prop re-render (if intermediates are memoized) | Every consumer re-renders on value change, regardless of intermediate memoization |

**Q: When would you choose prop drilling over Context, even for a value used a few levels down?**

When the number of intermediate levels is small (roughly 1-3) and the components in between are logically related to that data anyway. Prop drilling keeps data flow explicit and traceable in the component signatures, which can be more maintainable than introducing a Context for something simple, especially in code that's read more often than it's written.
