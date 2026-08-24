# Scenario: Dropdown Menu Gets Clipped by an `overflow: hidden` Parent

**Scenario:** A "select" dropdown component lives inside a card that has `overflow: hidden` (needed so the card's rounded corners clip its image content cleanly). When the dropdown opens, its menu — `position: absolute`, positioned below the trigger button — gets visually cut off at the card's boundary instead of floating freely above the rest of the page. Simply removing `overflow: hidden` isn't an option because the card's corner-clipping depends on it. How do you fix this?

**Diagnosis:**

`overflow: hidden` clips *all* descendant content to the element's box, including content that has been taken out of flow with `position: absolute`. Being absolutely positioned lets an element visually escape its parent's normal layout box, but it does **not** exempt it from an ancestor's `overflow: hidden` clipping — clipping applies to the ancestor's painted region regardless of how a descendant is positioned. So as long as the dropdown menu is a DOM descendant of the `overflow: hidden` card, it will be clipped at the card's edge the moment it visually extends past it.

**Fix — the real solution is to stop the menu from being a descendant of the clipping ancestor:**

1. **Render the dropdown menu into a portal** at the `<body>` level (or another ancestor outside the clipped card), exactly like the modal scenario. This is the most robust fix, especially for a reusable/library component that can't control what its consumers wrap it in.
2. **Position the menu using JS-measured coordinates** (e.g. via `getBoundingClientRect()` on the trigger button) once it's rendered outside the card, using `position: fixed` or `position: absolute` relative to a portal root, rather than relying on the card as its containing block.

```css
/* Portal-rendered menu, sibling of the card in the DOM instead of a descendant */
.dropdown-menu {
  position: fixed; /* or absolute relative to a body-level portal root */
  top: var(--menu-top);   /* set via JS from the trigger's getBoundingClientRect() */
  left: var(--menu-left);
}
```

**Why not just restructure the CSS instead of using a portal:** you could in principle move `overflow: hidden` to a more targeted wrapper around just the image (e.g. wrap only the image in its own clipping `<div>`, leaving the rest of the card's `overflow` as `visible`), and that's a legitimate fix when you control the card's markup. But for shared/reusable dropdown components used inside arbitrary consumer markup you don't control, a portal is the only fix that works unconditionally, since you can't guarantee no consumer will ever wrap the trigger in an `overflow: hidden` container.
