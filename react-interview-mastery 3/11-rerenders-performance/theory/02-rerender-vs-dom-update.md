# The Default Mental Model: "Everything Re-Renders, and That's Fine"

React's reconciliation (the virtual DOM diff) is cheap. Re-running a component function and diffing the resulting element tree against the previous one is usually microseconds. The actual expensive part is **committing** changes to the real DOM, and React only touches the DOM nodes that actually changed. So a re-render is not the same as a DOM update — most re-renders produce an identical tree and cost almost nothing.

This matters because premature optimization (wrapping everything in `memo`/`useMemo`/`useCallback`) adds complexity and its own overhead (extra comparisons, extra memory) without measurable benefit in most apps. Default to writing plain components; optimize only once you've identified an actual slow interaction.

## Re-render vs DOM update (commit)

| Aspect | Re-render | DOM update (commit) |
|---|---|---|
| What happens | Component function re-executes, produces new React elements | React diffs new/old element trees and applies the minimal set of real DOM mutations |
| Cost | Usually cheap (JS function call + diffing) | More expensive; layout/paint work on actual DOM nodes |
| Common mistake | Assuming "re-render" means "the DOM changed" and therefore optimizing renders that produce identical output | Not realizing that avoiding a re-render (via `memo`) is what actually skips the diff — the diff itself is usually not the bottleneck for small trees |

Optimize DOM churn (e.g., virtualization) when the tree is large or updates are frequent and visible in profiling; don't reflexively optimize re-renders that never touch the DOM.

## Is re-rendering the same as updating the DOM? Why does the distinction matter?

No. A re-render is React calling your component function and producing a new element tree; a DOM update (commit) only happens for the specific nodes that actually differ after React diffs the new tree against the old one. The distinction matters because most re-renders are cheap and produce zero DOM changes — chasing re-renders as if they're inherently expensive leads to premature `memo`/`useMemo` overuse.
