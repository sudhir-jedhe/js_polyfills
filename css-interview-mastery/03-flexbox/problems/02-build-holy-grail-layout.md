# Problem: Build a Holy-Grail Layout With Flexbox

## Problem Statement

Build the classic "holy grail" page layout: a full-width header and footer, and a middle section with a fixed-width left sidebar (220px), flexible main content, and a fixed-width right sidebar (180px). The layout must fill at least the full viewport height, with the footer pinned to the bottom on short-content pages (sticky-footer behavior), and the main content area must be independently scrollable if its content overflows, without the whole page scrolling.

## Constraints

- Use flexbox only (no grid).
- Sidebars must stay fixed-width and never grow/shrink.
- Main content must scroll internally (`overflow-y: auto`) rather than growing the page.
- Must work with `min-height: 100vh` semantics (short-content case still fills the viewport).

## Solution

```css
html, body {
  height: 100%;
  margin: 0;
}

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page__header,
.page__footer {
  flex: 0 0 auto;
  padding: 16px 24px;
}

.page__body {
  display: flex;
  flex: 1 1 auto; /* absorbs leftover vertical space between header/footer — the sticky-footer mechanism */
  min-height: 0; /* CRITICAL: without this, a flex item won't shrink below its content's height, breaking internal scroll */
}

.page__sidebar-left {
  flex: 0 0 220px;
  overflow-y: auto;
}

.page__main {
  flex: 1 1 auto;
  overflow-y: auto; /* scrolls independently of the page */
  min-height: 0; /* same reason as .page__body — required for overflow to actually kick in inside a flex item */
  padding: 24px;
}

.page__sidebar-right {
  flex: 0 0 180px;
  overflow-y: auto;
}
```

```html
<div class="page">
  <header class="page__header">Header</header>
  <div class="page__body">
    <nav class="page__sidebar-left">Left nav</nav>
    <main class="page__main"><!-- long scrollable content --></main>
    <aside class="page__sidebar-right">Right rail</aside>
  </div>
  <footer class="page__footer">Footer</footer>
</div>
```

**Why `min-height: 0` matters (the trap most people miss):** flex items have an automatic minimum main-size (in this nested case, cross-axis in the outer column, but main-axis-equivalent reasoning applies to `.page__body` itself as a column item) based on their content's size by default — meaning a flex item, by default, refuses to shrink smaller than its content needs, which silently defeats `overflow: auto` (there's nothing to scroll if the box just grows to fit everything). Setting `min-height: 0` explicitly overrides that automatic floor, allowing `.page__body` and `.page__main` to actually shrink to the available space and hand off any excess content to their own internal scrollbar instead of growing the whole page.

**Why this achieves sticky-footer behavior simultaneously:** `.page__body`'s `flex: 1 1 auto` inside the outer `column` flex container absorbs all leftover vertical space between header and footer on short-content pages (same mechanism as the sticky-footer scenario), while its own internal `overflow-y: auto` on `.page__main` means long content never forces the *whole page* to grow past the viewport — only the main content pane scrolls internally.
