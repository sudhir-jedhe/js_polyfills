*** copy 05-link-vs-import-performance.md ***

# `<link>` vs. CSS `@import` — Performance Implications

Both load an external stylesheet, but they differ significantly in *when* the browser discovers and fetches the resource — which is the entire performance story here.

## `<link rel="stylesheet">`

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

The browser's **preload scanner** — a secondary, lightweight parser that runs ahead of the main HTML parser specifically to discover resources early — finds `<link>` tags immediately while scanning the raw HTML markup, and kicks off the fetch **right away**, in parallel with everything else, before the main parser even reaches that point in the document.

## `@import`

```css
/* styles.css */
@import url('base.css');

body { margin: 0; }
```

`@import` is a **CSS-level** directive, not an HTML-level one — the preload scanner doesn't see it at all, because it only exists inside a stylesheet that itself has to be fetched and parsed first. This creates a **sequential chain**: the browser must fetch `styles.css`, start parsing it, discover the `@import`, and only *then* start fetching `base.css` — a full extra round trip that couldn't have started in parallel with the first.

## Side-by-side timeline

```html
<link rel="stylesheet" href="a.css">
<link rel="stylesheet" href="b.css">
```
→ `a.css` and `b.css` fetch **in parallel**, discovered instantly by the preload scanner.

```css
/* main.css */
@import url('a.css');
@import url('b.css');
```
→ `main.css` fetches first; only once its bytes arrive and are parsed far enough to find the `@import` rules do `a.css` and `b.css` begin fetching — and even then, browsers may fetch multiple `@import`s within the same file in parallel with each other, but **not** in parallel with `main.css` itself, since they can only be discovered after it's fetched.

## Why this matters for render-blocking

Since CSS blocks the render tree from being built until CSSOM is ready, every extra sequential round trip introduced by `@import` chains directly delays first paint. A stylesheet with several nested `@import`s can turn what should be one or two parallel round trips into three or four **sequential** ones — a meaningful, measurable performance regression, especially on higher-latency connections.

## Practical guidance

- Prefer multiple `<link rel="stylesheet">` tags in HTML over `@import` chains in CSS — let the preload scanner discover everything up front.
- If a build step (bundler) is available, prefer **bundling** stylesheets into one file over either approach — fewer requests overall beats even parallel `<link>` fetches, for small-to-medium stylesheets, since each request still carries its own connection/header overhead.
- `@import` is occasionally still reasonable for something like conditionally loading a stylesheet from within another stylesheet in very small/simple projects without a build step, but it should be treated as a known performance cost, not a neutral choice.
