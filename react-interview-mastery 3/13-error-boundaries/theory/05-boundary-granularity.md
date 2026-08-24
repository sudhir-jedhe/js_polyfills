# Boundary Granularity: Global vs Per-Section

A single **global** boundary at the app root is the minimum viable safety net — it prevents a full white-screen crash but takes down the entire UI for any error anywhere. **Per-section** boundaries (e.g., around a sidebar widget, a chart, a comments section) contain failures to just that section, letting the rest of the page keep working.

The common approach: one global boundary as a last resort, plus targeted boundaries around independently-failable, non-critical sections (widgets, third-party embeds, optional data panels) where showing "this widget failed to load" is far better UX than losing the whole page.

## Global (app-root) boundary vs per-section boundaries

| Aspect | Global boundary | Per-section boundaries |
|---|---|---|
| Blast radius on error | Entire app replaced with one fallback screen | Only the failing section shows a fallback; rest of the page keeps working |
| Setup cost | One boundary, minimal effort | More boundaries to place and maintain, more fallback UIs to design |
| Common mistake | Relying on only a global boundary, so any minor widget bug takes down the whole app | Wrapping every tiny component individually, adding overhead without meaningful isolation benefit — pick boundaries at meaningful, independently-useful UI sections |

Use a global boundary as the guaranteed last-resort safety net, and add per-section boundaries around independently-failable, non-critical widgets (third-party embeds, optional panels, less-tested features).

## Does memoization affect error propagation?

No. Wrapping a component in `React.memo`, or using `useMemo`/`useCallback` inside it, only affects whether/how often a component re-renders or recomputes values — it has no bearing on error propagation. An error thrown during that component's render is caught by the nearest ancestor boundary exactly the same way regardless of memoization.
