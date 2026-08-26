# Interview Q&A: Practical Patterns

**Q: How would you implement a "Try Again" button on an error boundary, and what's a common pitfall?**
Add a method that resets `hasError` to `false` via `setState`, which re-renders the (previously failing) children fresh. The pitfall: if the failure is deterministic (bad data, not a transient issue), simply resetting state and re-rendering the same children with the same bad input will throw again immediately — a real fix often needs to also change the underlying input (refetch data, reset a `key` to force full remount, or navigate the user elsewhere).

**Q: What is `react-error-boundary` and why would you use it over writing your own boundary class?**
It's a widely used library providing a ready-made `<ErrorBoundary>` component with `FallbackComponent`/`fallbackRender` props, a built-in `resetErrorBoundary` callback, and a `useErrorHandler` hook for surfacing async/event errors into the render phase. It removes the repetitive class-component boilerplate and standardizes reset/fallback conventions across a codebase.

**Q: How would you use an error boundary's `resetErrorBoundary` (or equivalent) together with async error handling?**
Catch the async error (e.g., in a `.catch()`), store it in state, then re-throw it synchronously during the next render (`if (error) throw error;`). The nearest error boundary catches this re-thrown error normally; its `resetErrorBoundary`/reset callback can then clear that error state before remounting children, giving async failures the same declarative fallback/retry UX as render errors.

**Q: How would you decide between one global error boundary and many section-scoped boundaries in a real app?**
Always keep one global boundary as a last-resort safety net for unexpected failures anywhere. Add section-scoped boundaries around independently-failable, non-critical UI — third-party embeds, optional widgets, less-tested feature areas — so a failure there degrades gracefully instead of taking down the whole page. Avoid wrapping every tiny component individually; that adds overhead without meaningful additional isolation.

**Q: Does wrapping a component in `React.memo` or using hooks like `useMemo`/`useCallback` inside it change how error boundaries interact with it?**
No. `memo`/`useMemo`/`useCallback` only affect whether/how often a component re-renders or recomputes values — they have no bearing on error propagation. An error thrown during that component's render is caught by the nearest ancestor boundary exactly the same way regardless of memoization.
