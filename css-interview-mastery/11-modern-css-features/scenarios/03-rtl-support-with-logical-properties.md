# Scenario: Adding RTL Support to an Existing LTR-Only App

**Situation:** A product that has only ever shipped in English (LTR) needs to add Arabic support. The existing CSS is full of physical properties (`margin-left`, `padding-right`, `left: 0`), and a full RTL launch is needed without doubling the size of the stylesheet with `[dir="rtl"]` overrides for every single component.

**Approach:** Systematically replace physical properties with their logical equivalents, component by component, rather than writing a parallel RTL override file.

```css
/* Before — LTR-only, requires a manual RTL override elsewhere for every rule */
.sidebar {
  float: left;
  margin-right: 1.5rem;
  border-right: 1px solid #e5e7eb;
  text-align: left;
}
[dir="rtl"] .sidebar {
  float: right;
  margin-right: 0;
  margin-left: 1.5rem;
  border-right: none;
  border-left: 1px solid #e5e7eb;
  text-align: right;
}

/* After — one rule, works correctly in both directions automatically */
.sidebar {
  float: inline-start;
  margin-inline-end: 1.5rem;
  border-inline-end: 1px solid #e5e7eb;
  text-align: start;
}
```

**Rollout approach:**
1. Start with the properties that have the highest RTL-breakage risk: `margin-left/right`, `padding-left/right`, `left`/`right` (for positioned elements), `border-left/right`, `text-align: left/right`, and `float: left/right`.
2. Convert one component at a time, verifying visually with `dir="rtl"` toggled on a test page, rather than attempting a single sweeping find-and-replace (some physical usages are intentional — e.g. an icon that should always point the same physical direction regardless of language, like a play button triangle, should usually stay physical).
3. Delete the corresponding `[dir="rtl"]` override rules as each component is migrated — the whole point is that logical properties make those overrides unnecessary, so a shrinking (and eventually empty) RTL override file is a good progress signal.

**Why this works:** logical properties resolve relative to the document's writing direction automatically, so a single rule set correctly serves both `dir="ltr"` and `dir="rtl"` without any conditional CSS — eliminating an entire category of override rules that would otherwise need to be authored and kept in sync with every future change to the base component styling.
