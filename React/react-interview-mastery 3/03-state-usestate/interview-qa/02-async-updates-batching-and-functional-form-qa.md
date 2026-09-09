***  02-async-updates-batching-and-functional-form-qa.md ***

# Interview Q&A — Async Updates, Batching, and the Functional Form

**Q: Why are state updates described as asynchronous, and what does that mean practically?**
Calling the setter doesn't synchronously update the variable in the current function's closure — it schedules an update that React applies before the next render. Practically, this means code immediately after a `setState` call in the same function still sees the old value, and multiple `setState` calls to the same piece of state in one handler using the direct (non-functional) form all read the same stale closure value rather than compounding.

**Q: What problem does the functional updater form (`setX(prev => ...)`) solve?**
It guarantees the update function receives the true latest pending state rather than a value frozen in a stale closure. This matters whenever you call the setter multiple times in the same tick, or from a callback (like a timeout or a promise) that might run after other updates have already been scheduled — using `prev => prev + 1` instead of `count + 1` avoids lost updates in both cases.

**Q: Does React guarantee that multiple `setState` calls in the same event handler will each cause a separate re-render?**
No — React batches multiple state updates that occur within the same synchronous block of work (an event handler, and since React 18, also timeouts/promises/native listeners) into a single re-render for efficiency, rather than re-rendering after each individual `setState` call.
