***  03-infinite-loops-and-unstable-dependencies-qa.md ***

# Interview Q&A — Infinite Loops and Unstable Dependencies

**Q: Why can an object or array literal as a dependency cause an infinite re-render loop?**
Because a new object/array literal is a new reference on every render, even if its contents are identical. If that object is listed as a dependency, React's per-dependency `Object.is` comparison sees a "change" on every render, re-running the effect every time — and if the effect also triggers a state update (directly or via a fetch that eventually calls `setState`), that causes another render, recreating the object again, and the cycle repeats indefinitely.

**Q: How do you fix an effect that infinitely loops because of an unstable object/function dependency?**
Prefer depending on the primitive values that actually matter (destructure the object's fields into the dependency array instead of the object itself) or construct the object inside the effect body so it's not a dependency at all. If the object genuinely must exist outside the effect and be shared, wrap its creation in `useMemo` (or the function in `useCallback`) keyed on its own primitive inputs so its reference stays stable across renders unless those inputs change.

**Q: Why might the `react-hooks/exhaustive-deps` ESLint rule flag a dependency you don't want to add, and what should you generally do about it?**
It flags any reactive value read inside the effect that's missing from the dependency array, because that's a very common source of stale-closure bugs — even if you "know" it's fine in a particular case, the rule can't verify that. The generally correct response is to fix the underlying reason you don't want to add it: use the functional updater form to avoid needing state, wrap unstable objects/functions in `useMemo`/`useCallback`, or move value creation inside the effect — not to add an eslint-disable comment, which should be a last resort with a clear justification.
