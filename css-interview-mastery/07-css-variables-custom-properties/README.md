# CSS Variables (Custom Properties)

Custom properties (`--my-property`, read via `var()`) are runtime, cascade-aware CSS values — unlike a preprocessor variable, they're real entries in the CSS Object Model that exist and can change in the browser at any time, and they follow the normal cascade and, critically, **inherit** by default, unlike almost every other CSS property. This topic covers custom property syntax, exactly how they cascade and inherit (a common trap, since most CSS properties do *not* inherit by default), `var()` fallback values, updating them live from JavaScript for theming, the typed-custom-property `@property` at-rule (which unlocks animatable custom properties and stricter validation), and the classic "custom properties vs. Sass variables" comparison that tests whether you understand compile-time vs. runtime value resolution.

## Folder structure

- **`theory/`** — concept-by-concept notes: syntax & `var()`, cascade/inheritance behavior, fallback values & invalid-value handling, runtime JS updates, `@property` typed custom properties, and custom properties vs. Sass variables.
- **`snippets/`** — 6 focused, runnable HTML+CSS(+JS) examples, one behavior per file.
- **`output-based/`** — 6 "what's the computed value" questions covering inheritance, fallback resolution, `@property` initial values, and JS interop, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (a dark-mode toggle, shared design tokens, animating a gradient angle, a themeable component library), each with a worked approach.
- **`interview-qa/`** — Q&A pairs grouped into 3 themed files: fundamentals, cascade/inheritance/fallbacks, and `@property`/Sass comparison.
- **`problems/`** — 4 hands-on coding challenges: a light/dark theme switcher, a typed animated progress ring, a design-token spacing scale, and a runtime-configurable button component.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- `--custom-property: value;` declaration syntax, and reading it with `var(--custom-property, fallback)`
- Why custom properties **inherit** by default (unlike `border`, `padding`, `background`, etc.), and how that interacts with the cascade
- `var()` fallback resolution rules, and what happens when a custom property's *value* is invalid at computed-value time (as opposed to simply undefined)
- Reading and writing custom properties from JavaScript via `getComputedStyle()`/`style.setProperty()`, and why that enables live theming without a page reload
- `@property` — registering a custom property with a type, initial value, and inheritance flag, which is what makes a custom property animatable/transitionable
- Custom properties (runtime, cascade-aware, DOM-inspectable) vs. Sass/Less variables (compile-time, textually substituted, no runtime presence at all)
