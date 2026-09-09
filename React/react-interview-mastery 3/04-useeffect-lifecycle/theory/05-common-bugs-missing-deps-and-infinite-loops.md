***  05-common-bugs-missing-deps-and-infinite-loops.md ***

# Common Bugs: Missing Dependencies and Infinite Loops

**Missing dependencies** — silences a real bug rather than fixing it; the ESLint `react-hooks/exhaustive-deps` rule exists specifically to catch this.

**Infinite loops from unstable object/array/function dependencies** — a new object literal or inline function is a *new reference* on every render, so if it's in the dependency array (or the effect itself updates state that recreates it), the effect re-runs every render, potentially triggering a state update that causes another render, forever:

```jsx
// Bug: `options` is a new object every render -> effect re-runs every render
function Bad({ userId }) {
  const options = { userId, cache: true }; // new reference each render
  React.useEffect(() => {
    fetchUser(options).then(/* ... */);
  }, [options]); // "changes" every render
}

// Fixed: depend on the primitive values the effect actually needs
function Good({ userId }) {
  React.useEffect(() => {
    fetchUser({ userId, cache: true }).then(/* ... */);
  }, [userId]); // only re-runs when userId actually changes
}
```

## Missing dependency vs. exhaustive dependency array

| Aspect | Missing a dependency the effect reads | Exhaustive dependency array (all reactive values listed) |
|---|---|---|
| Correctness | Silently stale — effect keeps using old captured value | Correct — effect always re-runs with fresh values when needed |
| Lint support | Flagged by `react-hooks/exhaustive-deps` (should not be disabled without a very good reason) | Passes lint cleanly |
| Common fallout | Bugs that only appear intermittently, hard to reproduce (classic stale closure) | Sometimes over-triggers the effect if a dependency changes reference every render (needs `useMemo`/`useCallback` or restructuring) |

Keep the dependency array exhaustive by default and solve "it re-runs too often" by stabilizing the *values* (memoizing objects/functions, depending on primitives instead of whole objects), not by removing them from the array. The common mistake is disabling the lint rule and manually curating deps to control timing, which reintroduces stale closures the rule exists to prevent.

If the object genuinely must exist outside the effect and be shared elsewhere, wrap its creation in `useMemo` (or the function in `useCallback`) keyed on its own primitive inputs so its reference stays stable across renders unless those inputs actually change — but depending on primitives directly, when possible, is simpler and preferred.
