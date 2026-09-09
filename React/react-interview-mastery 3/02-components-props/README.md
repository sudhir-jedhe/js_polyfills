***  README.md ***

# Components & Props

Function components are the unit of composition in React: plain JavaScript functions that accept a single `props` object and return JSX. This topic covers how props flow one-way from parent to child, why they're treated as read-only, the special `children` prop and composition patterns it enables, the prop-drilling problem that emerges in deeper trees, and practical patterns for default values and composing smaller components into larger ones. It also draws the line between "controlled" components (driven entirely by props/state from above) and "presentational" ones (pure rendering, no own logic), which is a distinction that comes up constantly in real code reviews and architecture discussions.

> Looking for your original notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — concept-by-concept notes: function components/props basics, props read-only semantics, `children`/composition, prop drilling and its alternatives, default props/component design heuristics, and PropTypes vs. TypeScript.
- **`snippets/`** — 7 focused, runnable code examples, one per file.
- **`output-based/`** — 7 "predict the output" questions covering prop mutation bugs, `children` normalization, default value semantics, and render order, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (deep-tree Context refactor, composable `Modal`, intermittent mutation bug, a flexible design-system `Table`), each with a worked approach.
- **`interview-qa/`** — 11 Q&A pairs grouped into 4 themed files: basics, children/composition/prop drilling, component design patterns, and mutation/validation pitfalls.
- **`problems/`** — 3 hands-on coding challenges: a `<Card>` component built with `children` composition (header/body/footer slots), a 3-layer prop-drilling example refactored away with composition instead of Context, and a lightweight from-scratch runtime prop-type validator (simplified PropTypes).
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`).

## What's covered

- Function components and the props object; props vs. state
- Props as read-only / immutable, and why mutating them causes silent bugs
- `props.children` and composition; `children` vs. named-slot props
- Prop drilling, and its alternatives: Context vs. composition
- Default prop values via destructuring
- Controlled vs. presentational component design heuristic
- PropTypes vs. TypeScript for prop validation
- Hands-on: a slot-based `Card`, a composition-based prop-drilling refactor, and a from-scratch simplified PropTypes validator
