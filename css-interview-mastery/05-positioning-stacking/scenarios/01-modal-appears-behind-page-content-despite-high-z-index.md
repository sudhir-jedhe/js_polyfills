# Scenario: Modal Appears Behind Page Content Despite `z-index: 9999`

**Scenario:** A team's modal component has `position: fixed; z-index: 9999;` on its overlay, yet it renders *behind* a page header that only has `z-index: 10`. Bumping the modal's `z-index` even higher (`999999`) doesn't fix it. How do you diagnose and fix this?

**Diagnosis:**

This is the classic parent-stacking-context trap. `z-index: 9999` only wins comparisons against elements *inside the same stacking context* as the modal. If the modal is rendered somewhere deep in the component tree — say, inside a card component that has `transform`, `filter`, `opacity < 1`, or `will-change` applied to it, or inside a container with `position: relative; z-index: 1;` — then the *entire subtree containing the modal* is capped at whatever rank that ancestor has in *its* parent's stacking context. Meanwhile, the header, if it's `position: sticky` or has its own `z-index` in a higher-ranked ancestor context, can out-rank the modal's whole branch regardless of the modal's own `z-index` value.

The fastest way to confirm this: open DevTools, select the modal overlay element, and walk up the ancestor chain checking computed styles for `transform`, `filter`, `opacity`, `will-change`, or `position` + `z-index`. The first ancestor (starting from the modal) that matches is the ceiling.

**Fix — two valid approaches:**

1. **Render the modal via a portal directly under `<body>`** (e.g. `ReactDOM.createPortal`, or in vanilla JS, `document.body.appendChild(modalRoot)`), so it's no longer a descendant of any component-level stacking context at all. This is the standard, most robust fix — it also solves the related "modal gets clipped by `overflow: hidden`" problem for free, since both issues stem from the same "trapped inside an ancestor's box/context" root cause.
2. If a portal genuinely isn't an option, trace every ancestor stacking-context trigger and either remove the ones that aren't load-bearing (e.g. an unnecessary `transform` left over from an old animation) or deliberately raise that ancestor's own `z-index` so its context out-ranks the header's context.

```css
/* Portal target rendered as a direct child of <body> */
#modal-root {
  position: fixed;
  inset: 0;
  z-index: 1000; /* now competing at the top level, not trapped inside any component wrapper */
}
```

**Why the portal approach is preferred in real codebases:** component-level wrappers accumulate `transform`/`filter`/`overflow` for all sorts of unrelated reasons over a codebase's lifetime (animations, card shadows, scroll clipping), and none of the modal's own code controls those. Rendering outside the tree removes the dependency on "no ancestor will ever add a stacking-context trigger," which is not a guarantee any single component can enforce on its own.
