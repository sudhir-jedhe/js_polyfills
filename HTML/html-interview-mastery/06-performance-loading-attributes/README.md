***  README.md ***

# Performance & Loading Attributes

How the browser fetches, parses, and executes HTML, CSS, and JS directly determines how fast a page feels — and a huge share of front-end performance work is really just correctly using the loading-related attributes and hints HTML already gives you. This topic is a favorite in interviews because the `defer`/`async`/plain-script execution-order question has an exact, precise answer that either you know cold or you don't — there's no room for hand-waving, which makes it a clean signal of real understanding versus memorized buzzwords.

## Folder structure

- **`theory/`** — script loading (`defer`/`async`/plain, with exact execution-order timelines), resource hints (`preload`/`preconnect`/`prefetch`/`dns-prefetch`), native `loading="lazy"`, the critical rendering path, `<link>` vs. `@import`, and a full worked "optimize this `<head>`" walkthrough.
- **`snippets/`** — 7 small, runnable examples covering each loading technique.
- **`output-based/`** — 7 "what's the execution/loading order?" questions, including the classic `defer` vs `async` trap.
- **`scenarios/`** — 5 real-world situations: a slow-to-interactive marketing page, a jQuery-dependent script breaking after switching to `async`, an image-heavy gallery, a font flash-of-invisible-text fix, and diagnosing render-blocking CSS.
- **`interview-qa/`** — Q&A grouped into themed files: script loading, resource hints & rendering path, and images/lazy-loading.
- **`problems/`** — 4 hands-on challenges: rewrite a blocking `<head>` for performance, build a lazy-loading image gallery, diagnose a real execution-order bug, and set up font-loading optimization.
- **`assets/`** — placeholder for diagrams (see `assets/README.md`).

## What's covered

- Precise execution-order semantics of plain `<script>`, `<script async>`, and `<script defer>` — parsing continues during `async`/`defer` fetches; `defer` executes in document order right before `DOMContentLoaded`; `async` executes as soon as ready, in arbitrary order
- `rel="preload"`, `preconnect`, `prefetch`, and `dns-prefetch` — what each does and when to use it
- `loading="lazy"` for images and iframes, and why it must be paired with explicit dimensions
- The critical rendering path: HTML parsing → DOM, CSSOM construction, render tree, layout, paint — and exactly how/why CSS and JS block it
- `<link rel="stylesheet">` vs. CSS `@import` and the sequential-fetch performance cost of `@import`
- Building a realistic, fully optimized `<head>` from a poorly optimized one
