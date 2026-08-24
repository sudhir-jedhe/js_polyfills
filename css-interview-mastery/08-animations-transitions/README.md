# Animations & Transitions

CSS gives you two distinct tools for making values change visually over time: `transition` (a simple, implicit "animate between value A and value B" for a property change, triggered by something else — a class toggle, `:hover`, a state change) and `animation` + `@keyframes` (a fully explicit, self-contained, multi-step sequence that can run without any external trigger, loop, and define arbitrary intermediate states). This topic covers when to reach for which, the full `@keyframes`/`animation-*` property set, timing functions, and — critically for interviews — the actual performance model underneath both: which CSS properties are cheap to animate (`transform`/`opacity`, handled by the compositor thread, not the main thread) versus which are expensive (`width`/`top`/`left`/most everything else, which trigger layout and/or paint on every frame), what `will-change` actually does and how it's commonly misused, and `prefers-reduced-motion` for accessibility. Interviewers use this topic specifically to separate candidates who can make something "animate" from candidates who understand *why* an animation is janky or smooth.

## Folder structure

- **`theory/`** — concept-by-concept notes: transition vs. animation, `@keyframes`/animation properties, timing functions, the compositor thread & cheap vs. expensive properties, `will-change` usage/misuse, and `prefers-reduced-motion`.
- **`snippets/`** — 6 focused, runnable HTML+CSS examples, one behavior per file.
- **`output-based/`** — 6 "what's the animation state/end value" questions covering `fill-mode`, `iteration-count`, `direction`, and transition triggering, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (transition-induced layout jank, a fade-in that doesn't play on first render, a list-reorder animation fighting a framework's re-renders, and motion-sickness accessibility), each with a worked fix.
- **`interview-qa/`** — Q&A pairs grouped into 3 themed files: transition vs. animation fundamentals, performance & the compositor, and `will-change`/accessibility.
- **`problems/`** — 4 hands-on coding challenges: a smooth-height accordion, a `@keyframes` loading spinner, a slide-in/out toast notification, and a staggered list entrance animation.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- `transition` (implicit, two-state, externally triggered) vs. `animation`/`@keyframes` (explicit, multi-state, self-triggering, loopable) — when each is the right tool
- `@keyframes` syntax, and the full `animation-*` property set: `duration`, `timing-function`, `delay`, `iteration-count`, `direction`, `fill-mode`, `play-state`
- Timing functions (`ease`, `linear`, `cubic-bezier()`, `steps()`) and what each communicates visually
- The compositor thread: why `transform`/`opacity` can animate at a smooth 60fps independent of the main thread, while properties that trigger layout (`width`, `top`, `margin`) or paint (`background-color`, `box-shadow`) cannot
- `will-change`: what it actually does (hints the browser to promote an element to its own layer ahead of time), and why applying it broadly/permanently is a common performance anti-pattern
- `prefers-reduced-motion`, and building animations that respect it by default rather than as an afterthought
