# Component Scope and Effects: Three Structural Anti-Patterns

## Components doing too much

A component that fetches data, manages five pieces of unrelated state, computes derived values, and renders a huge JSX tree is hard to test, hard to review (any change risks touching unrelated logic), and hard to reuse any single piece of its behavior elsewhere.

The fix is decomposition: extract data-fetching into a custom hook, break the JSX into smaller focused components, and keep each piece testable in isolation — letting the original component become a thin composition of the pieces.

## Overusing useEffect for derivable values

```jsx
// Before — unnecessary effect + extra render
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// After — compute during render
const fullName = `${firstName} ${lastName}`;
```

If a value can be computed directly from existing props/state during render, an effect just adds a redundant render cycle and a chance for the value to be briefly stale/wrong before the effect catches up. `useEffect` should be reserved for synchronizing with something genuinely *outside* React (the DOM, a subscription, a network request) — not for keeping two pieces of React state consistent with each other.

## Fetching in every component

Every sibling independently calling the same endpoint on mount duplicates network requests, delays rendering (each component waits on its own round trip instead of sharing one), and makes cache invalidation impossible to reason about since there's no single source of truth for the data.

Fix it by lifting the fetch to a shared ancestor and passing data down, or by introducing a shared cache (a simple module-level cache, context, or a library like React Query) so identical requests are deduped and shared across consumers.

## Why these three are grouped together

Each is a variant of the same underlying mistake: doing work (fetching, deriving, or rendering) at the wrong scope. An oversized component does too much at the component level; an unnecessary effect does derivation at the wrong *time* (after render instead of during it); redundant fetching does data-loading at the wrong *place* (every leaf instead of a shared ancestor or cache). Recognizing "is this the right scope for this work?" is the general skill interviewers are probing for across all three.
