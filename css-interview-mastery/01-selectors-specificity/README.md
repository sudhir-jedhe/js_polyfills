# Selectors & Specificity

CSS selectors decide *which* elements a rule applies to; specificity and the cascade decide *which rule wins* when more than one selector matches the same element. This is the single most-tested foundational CSS topic in interviews because it's where "I know CSS" candidates get tripped up by real code: a one-class selector losing to a three-element chain, `!important` fights, and `@layer`-based architecture that overrides specificity entirely. Getting the mental model precise — not hand-wavy — is what separates people who can debug a live specificity war from people who just add `!important` until it works.

## Folder structure

- **`theory/`** — selector types & combinators, the specificity calculation algorithm, `!important` and the cascade order, cascade layers (`@layer`), inheritance vs. specificity, and BEM as a specificity-avoidance strategy.
- **`snippets/`** — 6 focused, runnable selector examples, one concept per file.
- **`output-based/`** — 6 "which rule wins?" questions with the specificity worked out step by step.
- **`scenarios/`** — 4 real-world situations: a specificity war between two teams, an `!important`-riddled legacy stylesheet, overriding a third-party widget without touching its CSS, and migrating to BEM.
- **`interview-qa/`** — 10 Q&A pairs grouped into 3 themed files: selector fundamentals, specificity/cascade, and architecture/best practices.
- **`problems/`** — 3 hands-on challenges: ranking selectors by specificity, refactoring nested selectors into BEM, and building a cascade-layer-based reset system.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- Every selector category: type, class, ID, attribute, pseudo-class, pseudo-element, and combinators (descendant, child, adjacent sibling, general sibling)
- The specificity algorithm (ID / class / type columns), including `:is()`, `:not()`, `:has()`, and `:where()`
- `!important` and the full cascade order (origin, importance, layers, specificity, source order)
- `@layer` cascade layers and how they override specificity for normal (non-`!important`) declarations — and reverse priority for `!important` ones
- Inheritance vs. specificity: why inherited values always lose to *any* specified declaration, no matter how weak
- BEM as a deliberate strategy to keep specificity flat and predictable across a large codebase
