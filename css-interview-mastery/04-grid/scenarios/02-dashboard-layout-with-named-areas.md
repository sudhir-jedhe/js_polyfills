# Scenario: Dashboard Layout Built With Named Grid Areas

**Scenario:** An internal analytics dashboard has a fixed sidebar, a header, and a main content region containing 3 unevenly-sized panels (a large chart spanning two rows, a small stats summary, and a data table beneath the stats summary). The layout also needs to collapse to a single column on tablet, with the sidebar moving above the header. The team's first attempt nested several `display: flex` containers to approximate this and found the panel alignment (getting the chart, stats box, and table edges to line up cleanly) fragile and hard to reason about. How would you rebuild it with `grid-template-areas`?

**Approach:**

```css
.dashboard {
  display: grid;
  grid-template-columns: 220px 1fr 320px;
  grid-template-rows: 64px 1fr 1fr;
  grid-template-areas:
    "sidebar header header"
    "sidebar chart  stats"
    "sidebar chart  table";
  gap: 16px;
  min-height: 100vh;
}

.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.chart   { grid-area: chart; }
.stats   { grid-area: stats; }
.table   { grid-area: table; }

@media (max-width: 900px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto auto;
    grid-template-areas:
      "sidebar"
      "header"
      "chart"
      "stats"
      "table";
  }
}
```

**Why this is more robust than nested flex containers:** every panel's boundary is a literal, named grid line shared across the whole layout — `chart` spanning two rows automatically lines up its bottom edge with `table`'s bottom edge, because both are defined against the same explicit row tracks, not independently measured. With nested flexbox, achieving that same cross-panel alignment would require either matching heights by hand (fragile, breaks the moment content changes) or restructuring into a shared parent grid anyway — which is effectively reinventing what `grid-template-areas` gives for free. The responsive collapse is also just a second `grid-template-areas` re-declaration inside the media query — no `order`, no `flex-direction` juggling, no restructuring of the HTML at all, since every element already references its region by name via `grid-area` regardless of which layout is currently active.
