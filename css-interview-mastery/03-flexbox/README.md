# Flexbox

Flexbox is a one-dimensional layout model for distributing space and aligning items along a single axis (row or column), and it's the layout tool most front-end interviews probe hardest, because the questions aren't really about syntax — they're about the *algorithm*. Anyone can memorize `justify-content: space-between`; fewer people can correctly compute the final rendered width of three items with different `flex-grow`/`flex-shrink`/`flex-basis` values by hand, which is exactly the kind of question this topic drills. This folder covers container vs. item properties, the main/cross axis mental model, the grow/shrink math (including the classic shrink-factor trap), wrapping and gaps, and when to reach for flexbox over grid or vice versa.

## Folder structure

- **`theory/`** — flex-container properties, flex-item properties, main vs. cross axis, the grow/shrink/basis algorithm worked out in full, `flex-wrap`/`gap`, and a flexbox-vs-grid decision guide.
- **`snippets/`** — 6 runnable examples: a basic container, alignment properties, grow/shrink/basis, wrap+gap, `order`, and a holy-grail layout.
- **`output-based/`** — 6 "what's the final rendered width?" questions with the flex algorithm worked through step by step, including the flex-shrink weighting trap.
- **`scenarios/`** — 4 real bugs: nav items unexpectedly shrinking, building equal-height columns, a sticky footer, and a `space-between`-vs-`gap` wrapping bug.
- **`interview-qa/`** — 9 Q&A pairs across 3 themed files: fundamentals, grow/shrink/basis math, and patterns/traps.
- **`problems/`** — 3 hands-on challenges: a responsive navbar, a holy-grail layout, and an equal-height card row.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- Flex-container properties: `display: flex`, `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `gap`
- Flex-item properties: `flex-grow`, `flex-shrink`, `flex-basis` (and the `flex` shorthand), `align-self`, `order`
- The main axis vs. cross axis mental model, and how `flex-direction` flips which physical axis is "main"
- The precise grow/shrink distribution algorithm, worked through with real numbers — including why `flex-shrink` is weighted by `flex-basis`, not applied as a flat ratio (the classic interview trap)
- `flex-wrap` and how `gap` interacts with wrapped lines
- When to reach for flexbox vs. CSS Grid (full comparison table lives in `04-grid/theory`, referenced here too)
