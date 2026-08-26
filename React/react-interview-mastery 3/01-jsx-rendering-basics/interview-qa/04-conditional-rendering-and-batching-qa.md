*** copy 04-conditional-rendering-and-batching-qa.md ***

# Interview Q&A — Conditional Rendering and Batching

**Q: Why does `{count && <Badge />}` sometimes render a stray `0`?**
`&&` in JavaScript returns its left operand when that operand is falsy, not the boolean `false`. If `count` is `0`, the expression evaluates to `0`, and React does render numbers (unlike `false`/`null`/`undefined`, which are skipped). The fix is to ensure the left side is an actual boolean, e.g. `count > 0 && <Badge />`.

**Q: What's the difference between conditional rendering with `&&`/ternary versus an early `return`?**
`&&` and ternaries live inline inside the JSX tree and are best for small, localized branching. An early `return` exits the component function before building any JSX for that render path at all, which is clearer when an entire component has one dominant "empty/error/loading" state to short-circuit on. Overusing deeply nested ternaries inside JSX hurts readability; that's usually a sign to switch to an early return or extract a sub-component.

**Q: How does React batch state updates, and did this change in React 18?**
Batching means React groups multiple `setState` calls that happen within the same tick into a single re-render instead of one re-render per call. Before React 18, this only happened automatically inside React event handlers; updates inside `setTimeout`, promises, or native event listeners each triggered separate synchronous re-renders. React 18's automatic batching extends this to those cases too, so multiple state updates anywhere in a single synchronous block of work are batched by default (opt out per-update with `flushSync` if you truly need synchronous re-rendering).
