# Responsive Design & Media Queries

Responsive design is about writing CSS that adapts to whatever viewport, device, or container it ends up rendering in, rather than assuming a fixed screen size. This topic covers the mobile-first vs. desktop-first authoring strategies, `@media` query syntax (including the modern range syntax), the full family of viewport units (`vw`/`vh` and the newer `dvh`/`svh`/`lvh` that exist specifically to fix mobile browser UI chrome problems), `@container` queries (which respond to a component's own container size rather than the viewport — a modern and increasingly interview-relevant feature), responsive images (`srcset`/`sizes`/`<picture>`), and fluid typography with `clamp()`/`min()`/`max()`. Interviewers lean on this topic to test whether you understand *why* certain units behave differently on mobile (the address-bar-resize problem `dvh` solves) and whether you know the difference between a viewport-based and a container-based responsive mechanism.

## Folder structure

- **`theory/`** — concept-by-concept notes: mobile-first vs. desktop-first, media query syntax & features, viewport units and why `dvh` matters, container queries, responsive images, and fluid typography with `clamp()`.
- **`snippets/`** — 6 focused, runnable HTML+CSS examples, one behavior per file.
- **`output-based/`** — 6 "what breakpoint/value applies" questions covering cascade order between media queries, `vh` vs `dvh` on mobile, container vs. media queries, `clamp()` computed values, and `srcset` image selection, each with the answer and reasoning.
- **`scenarios/`** — 4 real-world engineering scenarios (a mobile hero cropped by the address bar, a component needing different layouts depending on where it's placed, blurry/slow images, and abrupt typography jumps at breakpoints), each with a worked fix.
- **`interview-qa/`** — Q&A pairs grouped into 3 themed files: mobile-first & media query fundamentals, viewport/modern units, and container queries & responsive images.
- **`problems/`** — 4 hands-on coding challenges: a mobile-first responsive navbar, a fluid type scale with `clamp()`, a card grid driven by container queries, and a responsive image gallery with `srcset`.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- Mobile-first (`min-width` breakpoints) vs. desktop-first (`max-width` breakpoints), and why mobile-first is the modern default
- `@media` syntax: media types, features, logical operators (`and`/`or`/`not`), and the newer range syntax (`(width >= 768px)`)
- `vw`/`vh` vs. the dynamic/small/large viewport units `dvh`/`svh`/`lvh`, and exactly why `100vh` breaks on mobile browsers with collapsing address bars
- `@container` queries: container-type, named containers, and how they differ fundamentally from `@media` (container size vs. viewport size)
- Responsive images: `srcset` + `sizes` for resolution switching, `<picture>` for art direction
- Fluid typography with `clamp(min, preferred, max)`, and `min()`/`max()` for flexible sizing without a media query at all
