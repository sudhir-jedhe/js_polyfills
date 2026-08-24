# Positioning & Stacking

CSS positioning (`static`/`relative`/`absolute`/`fixed`/`sticky`) controls *where* an element sits and *which box its offsets are relative to* (its containing block); stacking (stacking contexts and `z-index`) controls *what draws on top of what* along the imaginary z-axis. These two systems interact constantly, and most of the hard interview questions in this area come from that interaction — a `position: fixed` element that refuses to escape a transformed ancestor, a `sticky` header that silently stops sticking because of an `overflow` rule three levels up, or a `z-index: 9999` element that still renders *behind* a `z-index: 1` element because they belong to different stacking contexts. This topic builds a precise mental model of containing blocks and stacking contexts so those "impossible" bugs become predictable instead of mysterious.

## Folder structure

- **`theory/`** — concept-by-concept notes: the five `position` values and their containing blocks, `sticky`'s specific requirements and failure modes, what creates a stacking context, `z-index` rules within vs. across stacking contexts, and a deep dive on the containing-block algorithm.
- **`snippets/`** — 6 focused, runnable HTML+CSS examples, one behavior per file.
- **`output-based/`** — 6 "what renders/stacks where" questions covering the classic `z-index` trap, `sticky` failing under `overflow`, `fixed` trapped by a transformed ancestor, and more, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (a modal stuck behind content, a sticky sidebar that won't stick, a dropdown clipped by `overflow: hidden`, a misplaced tooltip inside a transformed card), each with a worked fix.
- **`interview-qa/`** — Q&A pairs grouped into 3 themed files: positioning fundamentals, stacking contexts & `z-index`, and `sticky`/containing blocks.
- **`problems/`** — 4 hands-on coding challenges: a sticky table header *and* first column, a modal with correct stacking, a dropdown that escapes clipping, and a reusable tooltip positioning system.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- `static`, `relative`, `absolute`, `fixed`, `sticky` — behavior and containing block for each
- Why `sticky` "stops working" (containing block height, `overflow` on an ancestor, missing offset)
- What creates a new stacking context (`position` + `z-index`, `opacity < 1`, `transform`, `filter`, `will-change`, `isolation: isolate`, and more)
- `z-index` comparison rules *within* a stacking context vs. the fact that an entire context stacks as one unit against siblings
- The containing-block algorithm for each `position` value, including how a `transform`/`filter`/`will-change` on an ancestor creates a containing block for `fixed` descendants
- Debugging strategies for "my `z-index` isn't working" and "my `position: fixed` element won't leave its box"
