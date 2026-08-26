*** copy 02-cleanup-and-stale-closures-qa.md ***

# Interview Q&A — Cleanup Functions and Stale Closures

**Q: When does an effect's cleanup function run?**
Twice in different circumstances: right before the effect re-runs due to a dependency changing (cleanup for the *old* values happens first, then the new effect body runs with the new values), and once more when the component unmounts entirely. This "clean up, then re-run" pattern lets each effect execution be treated as fully self-contained.

**Q: What is a stale closure in the context of `useEffect`, and how does it happen?**
It's when a function created inside an effect (e.g., an interval/timeout callback or an event listener) closes over props/state values as they existed at the time the effect ran, and that effect doesn't re-run when those values later change — so the callback keeps operating on outdated data indefinitely. It happens most commonly when a dependency is read inside the effect but omitted from the dependency array.

**Q: Given a stale closure bug where an interval logs an outdated `count`, what are two ways to fix it?**
Either add `count` to the dependency array (so the effect — and its interval — is recreated with a fresh closure whenever `count` changes), or, more idiomatically for accumulator-style updates, avoid needing `count` in the closure at all by using the functional updater form `setCount(c => c + 1)`, which always operates on the true latest state regardless of what the closure captured.
