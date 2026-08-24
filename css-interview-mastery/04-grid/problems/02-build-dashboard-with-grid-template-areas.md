# Problem: Build a Dashboard With `grid-template-areas`

## Problem Statement

Build an admin dashboard with: a fixed `240px` left sidebar spanning the full viewport height, a `64px` header across the top of the remaining space, a large chart panel and a smaller "recent activity" panel side by side beneath the header, and a full-width footer at the bottom. On viewports narrower than `800px`, collapse to a single column with the sidebar moving to the top, keeping the same DOM order.

## Constraints

- Must use `grid-template-areas` (not manual `grid-row`/`grid-column` line numbers).
- Sidebar must span every row in the desktop layout.
- The narrow-viewport layout must be achieved purely by redeclaring `grid-template-areas`/`grid-template-columns` inside a media query — no HTML changes, no `order`.

## Solution

```css
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  min-height: 100vh;
  gap: 16px;
}

.dashboard__sidebar { grid-area: sidebar; }
.dashboard__header  { grid-area: header; }
.dashboard__footer  { grid-area: footer; }

.dashboard__main {
  grid-area: main;
  display: grid;
  grid-template-columns: 2fr 1fr; /* chart gets twice the width of the activity panel */
  gap: 16px;
}
.dashboard__chart    { /* auto-placed into the first (2fr) column */ }
.dashboard__activity { /* auto-placed into the second (1fr) column */ }

@media (max-width: 800px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "sidebar"
      "header"
      "main"
      "footer";
  }
  .dashboard__main {
    grid-template-columns: 1fr; /* chart and activity panel stack instead of sitting side by side */
  }
}
```

```html
<div class="dashboard">
  <nav class="dashboard__sidebar">Sidebar</nav>
  <header class="dashboard__header">Header</header>
  <div class="dashboard__main">
    <div class="dashboard__chart">Chart</div>
    <div class="dashboard__activity">Recent Activity</div>
  </div>
  <footer class="dashboard__footer">Footer</footer>
</div>
```

**Why nesting a second grid inside `main` (rather than one flat set of areas) is the right call here:** the chart/activity split is a genuinely separate 2-column layout concern from the outer sidebar/header/footer shell — keeping it as its own nested grid means the outer `grid-template-areas` stays simple (4 named regions) and the inner chart/activity ratio can be tuned (or itself collapse in the media query) independently, without needing 6+ named areas in one increasingly hard-to-read outer declaration.
