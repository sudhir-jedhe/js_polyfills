# Pseudo-Classes & Pseudo-Elements

Pseudo-classes select real elements based on *state or position* that isn't visible in the HTML itself (`:hover`, `:nth-child(3)`, `:focus-visible`), while pseudo-elements target a *sub-part of an element* that doesn't exist as its own DOM node (`::before`, `::first-line`). Confusing the two — or misjudging their specificity — is a very common interview trap, especially around `:not()`/`:is()`/`:where()` and the relatively new `:has()` "parent selector." This topic covers both families in depth: interactive and structural pseudo-classes (including the `nth-child` formula math you need to compute by hand), the functional selectors and their specificity rules, generated content via pseudo-elements, and the practical limitations of `content`.

## Folder structure

- **`theory/`** — single vs double colon syntax, interactive state pseudo-classes (`:hover`/`:focus`/`:focus-visible`/`:focus-within`), structural pseudo-classes and `nth-child`/`nth-of-type` math, functional selectors (`:not()`, `:is()`, `:where()`, `:has()`) and their specificity, generated content via `::before`/`::after`, and the other common pseudo-elements.
- **`snippets/`** — 7 copy-pasteable examples: focus-visible vs focus, nth-child zebra striping, selector grouping, `:has()` form validation, generated-content icons/tooltips, drop caps, placeholder/selection styling.
- **`output-based/`** — 6 "what does this select?" questions covering `nth-child` formulas, `nth-of-type` vs `nth-child` with mixed siblings, `:not()`/`:is()`/`:where()` specificity, and `:has()` matching.
- **`scenarios/`** — 5 real-world builds: a CSS-only custom checkbox, a required-field asterisk with `:has()`, accessible keyboard-only focus styling, styling the Nth item in a dynamic list, and generated quote marks.
- **`interview-qa/`** — 3 themed Q&A files: pseudo-classes vs pseudo-elements, focus & accessibility, and the modern selector family (`:has()`/`:is()`/`:where()`).
- **`problems/`** — 4 hands-on challenges: a striped table with `nth-child`, a CSS-only tooltip, `:has()`-driven form validation styling, and an accessible focus-ring system.
- **`assets/`** — placeholder for diagrams/screenshots (see `assets/README.md`).

## What's covered

- Single-colon (`:`) pseudo-classes vs double-colon (`::`) pseudo-elements, and why browsers still accept single-colon `:before`/`:after` for legacy reasons
- `:hover`, `:active`, `:focus`, `:focus-visible` vs `:focus`, `:focus-within`
- `:nth-child(an+b)` / `:nth-of-type(an+b)` formula math, worked by hand
- `:not()`, `:is()`, `:where()` — what each does and how their specificity differs
- `:has()` as a relational "parent selector" (also cross-referenced from the modern CSS features topic)
- `::before` / `::after` and the `content` property — valid use cases and hard limitations (no real DOM node, limited accessibility exposure, can't hold form controls)
- `::first-line`, `::first-letter`, `::placeholder`, `::selection`, `::marker`
