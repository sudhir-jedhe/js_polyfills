***  06-batching.md ***

# Batching

React batches multiple state updates that occur within the same synchronous event handler (and, since React 18, inside promises, timeouts, and native event handlers too — "automatic batching") into a single re-render for performance, rather than re-rendering after every `setState` call.

```jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Only one re-render happens, after both updates are applied.
}
```

Before React 18, this only happened automatically inside React event handlers; updates inside `setTimeout`, promises, or native event listeners each triggered separate synchronous re-renders. React 18's automatic batching extends this to those cases too, so multiple state updates anywhere in a single synchronous block of work are batched by default. You can opt out per-update with `flushSync` (from `react-dom`) if you genuinely need a synchronous re-render between two updates — this is rare and usually only needed when reading layout/DOM state that depends on an intermediate render having already committed.

Batching is why reading state variables immediately after calling their setters (in the same function) still shows the old values — the update is scheduled, not applied synchronously. See the `03-state-usestate` topic for the closure mechanics behind this.
