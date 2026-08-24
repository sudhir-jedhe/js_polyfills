# Box Model & Layout

Every element on a page is a box, and the CSS box model — content, padding, border, margin — is the arithmetic that decides how big that box actually is and how it interacts with its neighbors. This topic covers the parts that trip candidates up in interviews *and* in real bugs: `content-box` vs. `border-box` sizing, the genuinely confusing rules of margin collapsing (adjacent siblings, parent/child, and empty blocks all behave differently), the `display` value that decides whether an element even participates in block flow, `overflow`'s effect on both scrolling and block-formatting-context creation, and `calc()` for mixing units. None of this is exotic CSS — it's the layer underneath flexbox and grid that still governs everyday element sizing.

## Folder structure

- **`theory/`** — box model anatomy, `content-box` vs. `border-box`, margin collapsing rules (with every edge case), `display` types, overflow & normal flow, and `calc()`.
- **`snippets/`** — 6 runnable examples: border-box reset, sibling/parent-child/empty-block margin collapsing, inline-block whitespace, and `calc()`.
- **`output-based/`** — 6 "what's the computed width/layout?" questions with the box-model math worked through step by step.
- **`scenarios/`** — 4 real bugs: an unexplained gap above a container, a sidebar overflowing its parent, a float-collapse layout bug, and a responsive card grid built with `calc()`.
- **`interview-qa/`** — 9 Q&A pairs across 3 themed files: box model fundamentals, margin collapsing, and display/overflow.
- **`problems/`** — 3 hands-on challenges: a global border-box reset, fixing a margin-collapsing bug, and a responsive card layout using `calc()`.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- The four box-model layers (content, padding, border, margin) and how `width`/`height` interact with them
- `box-sizing: content-box` (default) vs. `border-box`, and why almost every real project resets to `border-box`
- Margin collapsing: adjacent siblings, parent/first-child and parent/last-child, empty blocks, and what prevents collapsing (BFCs, padding, borders, flex/grid contexts)
- `display: block | inline | inline-block | none` (and a note on `flow-root`) and how each participates in layout
- `overflow: visible | hidden | scroll | auto` and how `overflow` other than `visible` creates a new block formatting context
- `calc()` for mixing absolute and relative units in one expression
