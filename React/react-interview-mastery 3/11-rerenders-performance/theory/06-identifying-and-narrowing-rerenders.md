# Identifying Unnecessary Re-Renders

You don't need a tool to reason about this, but the React DevTools **Profiler** is the standard way to confirm it: it records a session, shows a flamegraph of which components rendered and *why* (the "ranked" and "why did this render" info), and lets you compare commit durations. The workflow is: record an interaction, look for components that rendered but whose output didn't visibly change, then ask which of the three triggers (state, parent re-render, context) caused it.

## How would you use the React DevTools Profiler to confirm a re-render is unnecessary?

Record a session while performing the suspect interaction, then inspect the flamegraph/ranked chart for that commit. Check which components rendered and use the "why did this render" info; if a component shows up but its rendered output (and DOM diff) is identical to before, and its props/state/context genuinely didn't need to change, that's an unnecessary re-render worth fixing — typically via `memo` plus stabilized props, or by splitting state.

## Splitting components to narrow re-render scope

Moving fast-changing state into its own small component (e.g., a search input's value) prevents that state change from re-rendering unrelated siblings. This is often more effective than `memo`/`useCallback` gymnastics because it removes the re-render trigger entirely rather than trying to short-circuit it after the fact.

```jsx
// Before: SearchBox state lives in a big Parent, re-rendering everything below on each keystroke.
// After: isolate the input's state in its own leaf component.
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
function Page() {
  return (
    <>
      <SearchBox /> {/* keystrokes only re-render this component */}
      <ExpensiveDashboard />
    </>
  );
}
```

## How does splitting a component differ from memoizing it, as a performance strategy?

Memoizing (via `memo`) tries to *skip* a re-render after it's already been triggered. Splitting a component moves fast-changing state into its own smaller component so the re-render trigger never reaches the rest of the tree in the first place — it addresses the cause rather than short-circuiting the effect, and doesn't depend on prop reference stability to work.
