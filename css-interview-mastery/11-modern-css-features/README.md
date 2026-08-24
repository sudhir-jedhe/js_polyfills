# Modern CSS Features

CSS has shipped an unusual number of genuinely new capabilities in the last few years — features that previously required a preprocessor (nesting), JavaScript (`:has()`), or were simply impossible (native scoping via `@scope`, `subgrid`). This topic covers the modern feature set most likely to come up in a current interview: the `:has()` relational selector, native CSS nesting, `color-mix()` and modern color spaces like `oklch`/`lab`, `@scope`, `subgrid`, logical properties for internationalization, and `aspect-ratio`. Container queries and detailed positioning topics are covered in depth elsewhere in this repo — see the cross-references below rather than duplicated explanations here.

> **Cross-references (not duplicated here):** `:has()` is explained in full in `09-pseudo-classes-elements/theory/04-functional-pseudo-classes-not-is-where-has.md` — this topic's `:has()` file is a short recap plus modern-CSS-specific use cases. Container queries are covered in full in `06-responsive-design-media-queries` — this topic only briefly cross-references how they interact with the features covered here. Stacking/positioning fundamentals live in `05-positioning-stacking`.

## Folder structure

- **`theory/`** — `:has()` recap, native CSS nesting, `color-mix()` and modern color spaces (`oklch`/`lab`), `@scope` and `subgrid`, a brief container-queries cross-reference, and logical properties + `aspect-ratio`.
- **`snippets/`** — 7 copy-pasteable examples: native nesting, `color-mix()`, `oklch` colors, `@scope`, `subgrid`, logical properties, and `aspect-ratio`.
- **`output-based/`** — 5 questions on nesting's `&` selector, `color-mix()` results, `@scope` boundaries, logical properties under RTL, and subgrid track inheritance.
- **`scenarios/`** — 4 real-world builds: a responsive card grid with `subgrid`, a theme system built on `color-mix()`, adding RTL support via logical properties, and scoped component styles without a build tool via `@scope`.
- **`interview-qa/`** — 3 themed Q&A files: nesting & `@scope`, color & modern color spaces, and logical properties/container queries/`:has()` together.
- **`problems/`** — 3 hands-on challenges: a theme switcher built with `color-mix()`, a responsive card layout combining `aspect-ratio` and `subgrid`, and converting a physical (LTR-only) stylesheet to logical properties.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- `:has()` as a relational selector (full depth lives in the pseudo-classes topic — this is the modern-CSS-feature framing)
- Native CSS nesting — no preprocessor required, including the `&` selector and its differences from Sass nesting
- `color-mix()` for mixing colors in a specified color space, and modern color spaces (`oklch`, `lab`) vs `sRGB`/hex
- `@scope` for donut-scoped styling without a build tool
- `subgrid` for aligning nested grids to a parent's tracks
- Container queries (brief cross-reference only — full topic elsewhere)
- Logical properties (`margin-inline`, `padding-block`, etc.) and why they matter for RTL/i18n
- The `aspect-ratio` property
