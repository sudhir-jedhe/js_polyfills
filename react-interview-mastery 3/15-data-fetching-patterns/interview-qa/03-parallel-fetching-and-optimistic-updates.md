# Interview Q&A: Parallel Fetching and Optimistic Updates

**Q: What's a data-fetching waterfall, and how do you avoid one?**
A waterfall is when requests are sequenced unnecessarily — a child's fetch waits for a parent's fetch to finish even though it doesn't actually depend on that parent's data. Avoid it by identifying true dependencies (does request B actually need a value from request A's response?) and firing independent requests together with `Promise.all`, or by fetching all needed data at a common ancestor level.

**Q: What is an optimistic update, and what's the risk?**
It's updating the UI as if a mutation already succeeded before the server confirms it, to make the interaction feel instant. The risk is that the mutation can fail, requiring a rollback to the previous state (and ideally a user-visible indication that it failed) — so you need to keep a snapshot of the prior state and handle the error path deliberately, not just assume success.

**Q: How would you handle loading and error states for a fetch that depends on two other fetches finishing first?**
Track each fetch's status independently or combine them into a single derived status: loading if any are still pending, error if any failed, success only once all have resolved. Using `Promise.all` for the "fetch all three in parallel" case and one shared `status` state (`'idle' | 'loading' | 'success' | 'error'`) usually keeps this cleaner than three separate booleans that can get out of sync.

**Q: In what scenario is a waterfall actually the correct choice over parallel fetching?**
When the second request genuinely needs data only available from the first response — e.g., you need a `teamId` returned by `/api/me` before you can call `/api/teams/:teamId`. Forcing that into `Promise.all` doesn't work because the second call has no valid input yet; the dependency is real, not incidental.
