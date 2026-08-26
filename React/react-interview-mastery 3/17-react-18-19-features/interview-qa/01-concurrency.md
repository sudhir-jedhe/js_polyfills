# Interview Q&A: Concurrency

**Q: What is concurrent rendering, and does it make React "faster"?**
Concurrent rendering means React can start rendering an update, pause it midway if something more urgent comes in (like user input), work on the urgent update, and then resume or discard the paused one. It doesn't make any single render computationally faster — it makes the app feel more responsive by letting React prioritize urgent work over less important work, rather than blocking the main thread on whatever render started first.

**Q: What does `useTransition` actually do, and what does the `isPending` flag mean?**
It gives you a function (`startTransition`) to wrap a state update in, telling React that update is non-urgent and can be interrupted by higher-priority updates. `isPending` is `true` while that transitioned update is still being processed, letting you show a subtle loading indicator without blocking the rest of the UI.

**Q: When would you use `useDeferredValue` instead of `useTransition`?**
`useDeferredValue` is for when you have a value (often a prop, or state you don't directly control the setter for) and want a lagging, deferred version of it for an expensive computation, rather than wrapping the update that produced it. `useTransition` requires you to control the `setState` call itself; `useDeferredValue` works even when you only receive the value from elsewhere.
