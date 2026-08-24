# Interview Q&A: Batching

**Q: What changed with batching in React 18?**
In React 17, multiple `setState` calls were only batched into a single re-render when they occurred inside a React event handler; calls made inside `setTimeout`, promise callbacks, or native event listeners each triggered their own separate render. React 18 (via `createRoot`) batches automatically in all of these contexts, reducing unnecessary re-renders app-wide without any code changes.

**Q: How would you opt out of automatic batching for a specific update?**
Wrap the `setState` call in `flushSync` from `react-dom`, which forces React to apply that update and re-render synchronously before continuing, rather than batching it with other updates. This should be rare — it's an escape hatch for edge cases (like needing the DOM to reflect an update before a subsequent synchronous measurement), not a default habit.
