# CSS Architecture & Methodologies

Writing CSS that works on a single page is easy; writing CSS that stays maintainable across a team, hundreds of components, and years of changes is a different problem entirely. This topic covers the naming conventions and structural methodologies developed to solve that problem — BEM, OOCSS, and SMACSS — alongside the modern debate between utility-first CSS (Tailwind-style) and component-scoped CSS (CSS Modules, styled-components), plus the tools the platform itself now offers for managing specificity at scale: ITCSS-style layering and native `@layer` cascade layers. Expect interview questions that probe *why* a methodology exists (what pain it solves), not just its syntax.

## Folder structure

- **`theory/`** — BEM naming (Block\_\_Element--Modifier) with worked examples, OOCSS & SMACSS, utility-first vs component-scoped CSS tradeoffs, specificity management at scale, ITCSS layering, and native cascade layers (`@layer`).
- **`snippets/`** — 6 copy-pasteable examples: a BEM card component, OOCSS structure/skin separation, utility classes vs a component class side-by-side, CSS Modules scoping, basic `@layer` usage, and an ITCSS-style import order.
- **`output-based/`** — 5 questions on reading BEM class names, resolving specificity conflicts, cascade layer ordering, utility-class override order, and CSS Modules' generated class names.
- **`scenarios/`** — 5 real-world situations: refactoring spaghetti CSS to BEM, taming a specificity war in a legacy codebase, choosing Tailwind vs CSS Modules for a team, introducing cascade layers to a legacy app, and structuring a design system with ITCSS.
- **`interview-qa/`** — 3 themed Q&A files: methodologies (BEM/OOCSS/SMACSS), utility-first vs component-scoped tradeoffs, and specificity/cascade layers.
- **`problems/`** — 3 hands-on challenges: converting a plain-class stylesheet to BEM, building a layered reset with `@layer`, and refactoring over-specific selectors down to a manageable baseline.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- BEM: Block, Element, Modifier syntax and the reasoning behind flat, low-specificity class names
- OOCSS: separating structure from skin, and container from content
- SMACSS: categorizing rules into Base / Layout / Module / State / Theme
- Utility-first CSS (Tailwind-style) vs component-scoped CSS (CSS Modules, styled-components) — bundle size, reusability, specificity, and team-workflow tradeoffs
- Managing specificity at scale as a codebase and team grow
- ITCSS: layering stylesheets from generic to explicit so specificity naturally increases with source order
- Native CSS cascade layers (`@layer`) as a browser-supported alternative/complement to ITCSS conventions
