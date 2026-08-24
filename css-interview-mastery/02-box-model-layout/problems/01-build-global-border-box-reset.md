# Problem: Build a Global `border-box` Reset (and Explain What It Fixes)

## Problem Statement

Write a small global CSS reset that: (1) puts every element into `border-box` sizing, (2) zeroes out default browser margins on common block elements so spacing is fully author-controlled, (3) removes default list styling, and (4) sets a sane default line-height. Then demonstrate, with a before/after example, exactly what bug the `border-box` part fixes.

## Constraints

- The reset must apply `border-box` to pseudo-elements too (`::before`/`::after`), not just real elements.
- Don't reset properties you don't have a stated reason for touching (keep it minimal and purposeful, not a giant kitchen-sink reset).

## Solution

```css
*, *::before, *::after {
  box-sizing: border-box;
}

body, h1, h2, h3, h4, p, figure, blockquote, dl, dd {
  margin: 0;
}

ul, ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

body {
  line-height: 1.5;
}
```

**Before/after demonstrating the `border-box` fix:**

```css
/* WITHOUT the reset (content-box, the browser default) */
.card { width: 300px; padding: 24px; border: 1px solid #ccc; }
/* renders at 300 + 48 + 2 = 350px total — 50px wider than the "300px" a developer would expect */
```

```css
/* WITH the reset applied */
.card { width: 300px; padding: 24px; border: 1px solid #ccc; }
/* renders at EXACTLY 300px total — padding/border are now included within the declared 300px */
```

**Why `*` rather than only `html` + inherited `box-sizing`:** the `html`-plus-inheritance pattern (`html { box-sizing: border-box; } *, *::before, *::after { box-sizing: inherit; }`) exists to let a component author locally opt an element back into `content-box` by setting `box-sizing: content-box` on a specific ancestor and letting descendants inherit it — a flexibility almost no real project actually uses. The flat `*` selector is simpler, has the exact same practical effect for the overwhelming majority of codebases, and is what you'll find in most current CSS resets, including browser vendors' own suggested baselines.

**Why `::before`/`::after` need to be included explicitly:** pseudo-elements don't automatically inherit properties set via the universal selector unless the universal selector's compound form explicitly includes them (`*, *::before, *::after`) — omitting them is a common reset bug where generated content (icons, decorative elements) ends up sized under `content-box` while everything else correctly uses `border-box`.
