***  03-team-over-memoizes-everything.md ***

# Scenario: A Team Is Memoizing Everything "For Performance"

You're reviewing a PR where a mid-size form component wraps every derived value in `useMemo` and every handler in `useCallback`, even trivial ones (`useMemo(() => name.trim(), [name])`, `useCallback(() => setOpen(true), [])`), none of which are passed to a `React.memo` child or used in another hook's deps.

**Approach:** Push back constructively: memoization isn't free — it adds a dependency array that has to stay correct (a maintenance burden and a common source of stale-value bugs) and a small runtime overhead for the comparison itself, in exchange for avoiding a recomputation that, for a `.trim()` call, is cheaper than the memoization machinery itself. Recommend removing memoization unless one of these is true: (1) the computation is measurably expensive, (2) the value/function is passed to a component wrapped in `React.memo`, or (3) it's a dependency of another hook where referential stability actually prevents unwanted reruns.

```jsx
// Unnecessary — trim() on a short string is cheaper than useMemo's bookkeeping
const trimmedName = useMemo(() => name.trim(), [name]);

// Just do this instead
const trimmedName = name.trim();

// Unnecessary — setOpen(true) isn't passed to a memoized child or used as a dep elsewhere
const openModal = useCallback(() => setOpen(true), []);

// Just do this instead
const openModal = () => setOpen(true);
```

Suggest the team default to plain values/functions, and reach for `useMemo`/`useCallback` reactively — once profiling (React DevTools Profiler, or a visible jank issue) actually points at a specific component.
