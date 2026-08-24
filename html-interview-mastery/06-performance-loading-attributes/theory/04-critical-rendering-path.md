# Critical Rendering Path Basics

The critical rendering path is the sequence of steps the browser takes from receiving HTML bytes to actually painting pixels on screen. Understanding where CSS and JS *block* this path is the foundation for almost every other performance optimization in this topic (`defer`/`async`, `preload`, lazy loading).

## The high-level sequence

1. **HTML parsing → DOM construction.** The browser parses HTML bytes incrementally, building the DOM tree as it goes.
2. **CSS parsing → CSSOM construction.** CSS (from `<link>`, `<style>`, or inline) is parsed into the CSSOM (CSS Object Model) — a tree of every matched style rule.
3. **DOM + CSSOM → Render Tree.** The browser combines DOM and CSSOM into a render tree, containing only the nodes that will actually be visible (elements with `display: none` are excluded entirely; `visibility: hidden` elements ARE included, since they still occupy layout space).
4. **Layout (a.k.a. Reflow).** The browser computes the exact position and size of every render tree node.
5. **Paint.** Pixels are actually drawn — text, colors, images, borders, shadows — onto layers.
6. **Composite.** Layers are combined in the correct order and displayed on screen (with GPU acceleration for eligible layers, like `transform`/`opacity` animations).

## Why CSS blocks rendering

The render tree **cannot be built without the CSSOM** — the browser must know an element's computed styles before it can decide layout and paint. This means **CSS is render-blocking by default**: the browser withholds the first paint until all CSS discovered so far has been fetched and parsed, to avoid painting unstyled content and then immediately repainting once styles arrive (a flash of unstyled content, FOUC).

```html
<link rel="stylesheet" href="styles.css"> <!-- blocks rendering until fetched + parsed -->
```

This is why large, render-blocking stylesheets in `<head>` directly delay First Contentful Paint, and why splitting out a small "critical CSS" (just enough to style above-the-fold content) inlined directly in `<head>`, with the rest loaded non-blocking, is a classic optimization technique.

## Why JS blocks HTML parsing (and can also block on CSS)

A plain `<script>` (no `async`/`defer`) **pauses HTML parsing** entirely while it fetches and executes — covered in depth in the script-loading theory file. There's a second, less obvious blocking relationship: **a synchronous script that runs before a stylesheet has finished loading will itself wait for that stylesheet**, because the script might query computed styles (`getComputedStyle`) or otherwise depend on CSSOM being ready — so the browser conservatively delays script execution until any preceding CSSOM-affecting `<link>` has finished, even though CSS and JS are technically "different" blocking mechanisms.

```html
<link rel="stylesheet" href="styles.css">
<script src="app.js"></script>
<!-- app.js execution waits for BOTH its own fetch AND styles.css to finish parsing -->
```

## Summary of blocking relationships

| Resource | Blocks HTML parsing? | Blocks first paint? |
|---|---|---|
| Plain `<script src>` (no attribute) | Yes — parser stops until fetched + executed | Yes, indirectly (parsing is paused, so nothing after it can even become part of the DOM/render tree yet) |
| `<script defer>` / `<script async>` | No — fetched in parallel | Not by fetching, but `async` scripts executing mid-parse can still cause parsing pauses at that moment |
| `<link rel="stylesheet">` (no `media` restriction) | No (parsing continues) | **Yes** — render tree can't be built without CSSOM |
| `<link rel="stylesheet" media="print">` | No | No — doesn't apply to the current rendering context, so the browser doesn't block on it for screen rendering |
| Images | No | No (rendering proceeds with a placeholder box; the image paints in once decoded) |

## Practical implications

- Put stylesheets in `<head>` (so CSSOM is ready as early as possible) but keep them small/critical, deferring non-critical CSS.
- Put scripts with `defer` (or at the end of `<body>`, historically) so they don't block parsing.
- Minimize the number of render-blocking resources in the initial critical path — every additional blocking `<link>`/synchronous `<script>` adds to the time before first paint.
- `media` attributes on `<link>` (e.g., `media="print"`) let the browser deprioritize a stylesheet's blocking behavior for the current rendering context, since it fetches the resource but doesn't need it to render the current view.
