# Automatic Batching

Before React 18, React only batched multiple `setState` calls together into a single re-render inside React event handlers. Outside of them — inside `setTimeout`, native event listeners, or Promise callbacks — every `setState` triggered its own separate re-render. React 18 batches everywhere automatically:

```jsx
function handleClick() {
  setTimeout(() => {
    setCount((c) => c + 1);
    setFlag((f) => !f);
    // React 17: two re-renders. React 18: one re-render.
  }, 1000);
}
```

This is a real behavior change worth knowing explicitly, because code that relied on synchronous, per-`setState` re-renders outside event handlers (rare, but it happens) can behave differently after upgrading — for example, a test asserting on an intermediate DOM state between two updates that used to render separately.

## Opting out with flushSync

You can opt out for a specific update with `flushSync` if you truly need an immediate, unbatched render:

```jsx
import { flushSync } from "react-dom";

function handleClick() {
  flushSync(() => {
    setCount((c) => c + 1); // commits immediately, own render
  });
  flushSync(() => {
    setFlag((f) => !f); // commits immediately, separate render
  });
}
```

This should be rare — it's an escape hatch for edge cases (like needing the DOM to reflect an update before a subsequent synchronous measurement), not a default habit, since it opts out of a performance optimization.

## React 17 vs. React 18

| Aspect | React 17 | React 18 (with `createRoot`) |
|---|---|---|
| Batching in event handlers | Yes | Yes |
| Batching in `setTimeout`/promises/native listeners | No — each `setState` triggers its own render | Yes — batched automatically |
| Opt-out mechanism | N/A (already unbatched outside handlers) | `flushSync` forces an immediate, unbatched commit |
| Common mistake | Assuming async-context updates always batch, writing code that (unknowingly) relied on React 17's forced separate renders | Upgrading to React 18 without testing code that relied on the old unbatched-outside-handlers behavior (e.g., checking intermediate DOM state between updates) |

Know this as a real, cited behavior change — it's one of the most commonly asked "what changed in React 18" questions.
