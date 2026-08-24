# Interview Q&A: Fetching Lifecycle and Race Conditions

**Q: Why is fetching data directly in the component body (not inside `useEffect`) a problem?**
Fetching during render runs on every render, including re-renders caused by unrelated state changes, and can trigger infinite loops if the fetch eventually causes a state update, which triggers another render, which fetches again. `useEffect` scopes the fetch to specific dependency changes (mount, or when specified values change), giving you control over when it actually fires. Data fetching is a side effect, and side effects belong in `useEffect` (or an event handler for user-triggered actions), not in the render function which should stay pure.

**Q: What causes a race condition in `useEffect` data fetching, and how do you fix it?**
It happens when a dependency (like an `id` prop) changes before a prior request for the old value resolves, and responses arrive out of order — the UI ends up showing data for a value it's no longer displaying. Fix it by cancelling the previous request when the effect re-runs, using `AbortController` passed into `fetch`'s `signal` option, or a simpler boolean "cancelled" flag checked before calling `setState` in the `.then`.

**Q: What does the cleanup function returned from `useEffect` do in the context of fetching?**
It runs before the effect re-runs (when dependencies change) and when the component unmounts. For fetching, you use it to abort the in-flight request (`controller.abort()`) or set a flag so a late-arriving response is ignored, preventing both race conditions and wasted state updates.

**Q: What's the difference between an `AbortError` and other fetch errors, and why does it matter?**
When you call `AbortController.abort()`, the corresponding `fetch` promise rejects with a `DOMException` whose `name` is `"AbortError"`. This isn't a real failure — it's an intentional cancellation, usually because the component moved on. You need to catch and special-case it (`if (err.name !== "AbortError")`) so you don't incorrectly show an error UI for a request you cancelled on purpose.

**Q: Why might `setLoading(true)` at the top of an effect cause a bug when `userId` changes quickly?**
If you don't also handle stale responses, setting `loading` back to `true` on every dependency change is fine for the spinner, but the underlying race condition (an old, slow request resolving after a newer, fast one) still exists — the loading indicator disappearing doesn't mean the *correct* data was the one that arrived. Loading state and correctness are separate problems; fixing the spinner doesn't fix the race.
