***  README.md ***

# Lists, Keys & Conditional Rendering

Rendering collections with `.map()` and conditionally showing UI are two of the most common things you do in React, and both are riddled with subtle bugs that trip up even experienced engineers. This topic covers how React's reconciliation algorithm uses the `key` prop to match elements across renders, why using the array index as a key silently corrupts component state in reorderable or filterable lists, and the rules around key uniqueness. It also covers the classic `count && <Component />` bug where a falsy number renders as a literal `0` on the page instead of nothing.

## What's covered
- Rendering arrays with `.map()` and returning JSX
- How React's diffing algorithm uses `key` to match elements between renders
- Why index-as-key breaks with reorderable/filterable/insertable lists (concrete bug walkthrough)
- Key uniqueness scope: only needs to be unique among siblings, not globally
- Conditional rendering patterns: `&&`, ternaries, early returns, `?? `
- The `count && <Component/>` renders-a-literal-`0` pitfall and how to avoid it

## Structure

- `theory/` — concept notes, one file per topic area
- `snippets/` — one short standalone example per file
- `output-based/` — "what does this log/render" questions with answers
- `scenarios/` — realistic problem → approach walkthroughs
- `interview-qa/` — Q&A grouped by theme, including comparison tables
- `problems/` — hand-implemented build exercises (index-key bug demo, empty-state pattern, nested lists)
- `assets/` — supporting images/PDFs (see below)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
