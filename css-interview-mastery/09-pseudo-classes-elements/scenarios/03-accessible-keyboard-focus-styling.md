# Scenario: A Design System's Focus Ring Was Removed Site-Wide

**Situation:** A previous engineer added `* { outline: none; }` globally to "clean up the ugly blue outlines," and now the QA/accessibility audit flags the entire site for failing WCAG 2.4.7 (Focus Visible) — keyboard users have no way to see which element currently has focus anywhere on the site.

**Approach:** Don't just delete the rule (that reintroduces the "focus ring on every mouse click" complaint that likely motivated the original change) — replace the blanket removal with a `:focus-visible`-driven system.

```css
/* Remove the blanket rule */
/* * { outline: none; }  <- delete this */

/* Instead: no ring for mouse-detected focus, clear ring for keyboard/AT-detected focus */
:focus {
  outline: none;
}
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

/* Custom interactive components (divs with role="button" etc.) need this applied explicitly too,
   since they don't get free native focus styling */
[role="button"]:focus-visible,
[tabindex]:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

**Why this works:** `:focus-visible` is browser-driven — it fires for keyboard/assistive-technology focus and (per each browser's own heuristic) generally not for mouse clicks, so it resolves the exact complaint the blanket removal was trying to fix without sacrificing accessibility. Rolling this out means auditing every interactive component (not just native `<button>`/`<a>`/`<input>`) since custom widgets need the same `:focus-visible` treatment applied explicitly. As a stopgap for older browsers without `:focus-visible` support, a `:focus` fallback (`outline: 2px solid` behind an `@supports not selector(:focus-visible)` block) keeps focus visible everywhere, just without the "hide on mouse click" refinement.
