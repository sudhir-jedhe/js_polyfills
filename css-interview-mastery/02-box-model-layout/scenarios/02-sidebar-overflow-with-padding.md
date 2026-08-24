# Scenario: Sidebar Overflowing Its Parent Because of Padding

**Scenario:** A two-column layout has a sidebar sized with `width: 25%` and `padding: 24px` inside a flex container. On smaller viewports, the sidebar visibly overflows its flex container's bounds and pushes the main content column off-screen, even though `25%` should easily leave room. What's happening, and how do you fix it?

**Diagnosis:** The project never reset `box-sizing`, so `width: 25%` under the default `content-box` model sizes only the *content area* — the `24px` padding on all four sides is added **on top** of that 25%, making the sidebar's true rendered width `25% + 48px`. At narrow viewports, `48px` is a much larger fraction of the total width, and that extra width is exactly what's shoving the main content column out.

**Fix:**

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

With `border-box`, `width: 25%` now includes the padding — the sidebar's *content* area shrinks by 48px internally, but the sidebar's total rendered width stays exactly `25%` of its container at every viewport size, and the overflow disappears without touching the `25%`/`24px` values at all.

**Verifying the fix, and preventing recurrence:** check that the global `border-box` reset is actually loaded before any component-specific CSS (it should live in the base/reset layer, loaded first, so no component can accidentally render under `content-box` due to load-order surprises), and add it to the project's default boilerplate/starter template so it's never something a new component author has to remember. In code review, treat any `width`/`height` set alongside `padding` or `border` on an element without a confirmed `border-box` reset in scope as a flag worth double-checking.
