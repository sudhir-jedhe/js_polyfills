# Interview Q&A: Component Structure and Effects

**Q: What's wrong with a component that fetches data, holds a dozen unrelated state variables, and renders a huge JSX tree all in one file?**
It's hard to test in isolation, hard to review (any change risks touching unrelated logic), and hard to reuse any single piece of its behavior elsewhere. The fix is decomposition: extract data-fetching into a custom hook, break the JSX into smaller components each with a focused responsibility, and let the original component become a thin composition of the pieces.

**Q: When is it wrong to use `useEffect` to keep one piece of state in sync with another?**
Whenever the "synced" value can be computed directly from existing props/state during render — an effect in that case adds an unnecessary extra render cycle and can briefly show a stale/incorrect value before the effect catches up, in addition to more code than a plain derived expression. `useEffect` should be reserved for synchronizing with something *outside* React (the DOM, a subscription, a network request), not for keeping two pieces of React state consistent with each other.

**Q: Why is having many sibling components each independently fetch the same or overlapping data a problem, and how do you fix it?**
It duplicates identical network requests, delays rendering (each component waits on its own round trip instead of sharing one), and makes cache invalidation impossible to reason about since there's no single source of truth for the data. Fix it by lifting the fetch to a common ancestor and passing data down, or by introducing a shared cache (a simple module-level cache, context, or a library like React Query) so identical requests are deduplicated and shared across consumers.
