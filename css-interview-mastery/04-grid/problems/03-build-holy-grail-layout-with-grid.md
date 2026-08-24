# Problem: Build the Holy-Grail Layout With Grid

## Problem Statement

Rebuild the classic holy-grail layout (full-width header and footer; middle row with a fixed `220px` left sidebar, flexible main content, and a fixed `180px` right sidebar) using CSS Grid instead of flexbox, and compare the result to the flexbox version from `03-flexbox/problems/02-build-holy-grail-layout.md`.

## Constraints

- Use `grid-template-areas` for readability.
- Must fill at least the full viewport height, with the footer pinned to the bottom on short-content pages.
- Main content must scroll independently on overflow, same requirement as the flexbox version.

## Solution

```css
html, body {
  height: 100%;
  margin: 0;
}

.page {
  display: grid;
  grid-template-columns: 220px 1fr 180px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header header"
    "navleft main   navright"
    "footer  footer footer";
  min-height: 100vh;
}

.page__header { grid-area: header; }
.page__footer { grid-area: footer; }

.page__nav-left {
  grid-area: navleft;
  overflow-y: auto;
}

.page__main {
  grid-area: main;
  overflow-y: auto;
  min-height: 0; /* same reasoning as the flexbox version — a grid item also won't shrink below content size without this */
  padding: 24px;
}

.page__nav-right {
  grid-area: navright;
  overflow-y: auto;
}
```

```html
<div class="page">
  <header class="page__header">Header</header>
  <nav class="page__nav-left">Left nav</nav>
  <main class="page__main"><!-- long scrollable content --></main>
  <aside class="page__nav-right">Right rail</aside>
  <footer class="page__footer">Footer</footer>
</div>
```

**Comparison with the flexbox version:**

| | Flexbox version | Grid version |
|---|---|---|
| Nesting required | Yes — an outer `column` flex container plus an inner `row` flex container for the middle band | No — a single grid handles both dimensions (3 columns × 3 rows) in one declaration |
| Sidebar widths | Set via `flex: 0 0 220px` / `flex: 0 0 180px` on items | Set directly in `grid-template-columns: 220px 1fr 180px` |
| Readability of overall shape | Requires reading two separate flex containers to reconstruct the layout mentally | The `grid-template-areas` ASCII diagram shows the whole shape in one glance |
| `min-height: 0` gotcha for internal scroll | Needed on the flex item acting as the scrollable row | Needed on the grid item the same way — this constraint isn't flexbox- or grid-specific, it's inherent to how both formatting contexts size items relative to their content by default |

**Takeaway:** grid is a natural fit here specifically because the holy-grail layout genuinely is two-dimensional (3 columns × 3 rows) — this is a good concrete illustration of the grid-vs-flexbox decision heuristic from the theory file: flexbox required *nesting* to fake two dimensions, while grid expresses the same structure natively in one container.
