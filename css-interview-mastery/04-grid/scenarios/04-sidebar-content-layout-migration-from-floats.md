# Scenario: Migrating a Float-Based Sidebar Layout to Grid

**Scenario:** A legacy blog template lays out its sidebar with `float: right; width: 300px;` on the sidebar and relies on the main content column simply not being wide enough to run under it (no explicit width set on main content — it just fills whatever's left of the containing block, minus the float). This has two chronic problems: the footer needs a clearfix hack to avoid rendering above the bottom of a tall floated sidebar, and there's no clean way to reorder sidebar-above-content on mobile without duplicating markup. How do you migrate this to grid?

**Before (floats):**
```css
.sidebar { float: right; width: 300px; }
.content { /* no width set — implicitly fills remaining space next to the float */ }
.footer  { clear: both; } /* required so the footer doesn't render alongside/above a tall floated sidebar */
```

**After (grid):**
```css
.page {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-areas:
    "content sidebar"
    "footer  footer";
  gap: 24px;
}
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.footer  { grid-area: footer; }

@media (max-width: 700px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas:
      "sidebar"
      "content"
      "footer";
  }
}
```

**Why this is a strict improvement, not just a different way to get the same result:**
1. **No clearfix needed anywhere.** Grid items always contribute fully to their container's height and to sibling layout — there's no "floated element ignored by normal flow" behavior to work around, so the footer's `clear: both` (and the entire class of float-containment bugs) disappears along with the floats themselves.
2. **Reordering for mobile is a one-line change**, not a markup restructure — the media query just redeclares `grid-template-areas` with `sidebar` listed before `content`; both elements stay in their original DOM order (good for accessibility/reading order), only their *visual* position changes, driven entirely by the named-area mapping.
3. **The content column's width is now explicit** (`1fr`, filling whatever's left of the fixed `300px` sidebar) rather than implicit ("whatever happens to not be under the float") — which is more predictable, especially once other elements (e.g. a `max-width` centering wrapper) enter the picture and might otherwise interact unpredictably with float-based sizing.
