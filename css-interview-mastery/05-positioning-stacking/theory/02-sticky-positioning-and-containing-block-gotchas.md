# `position: sticky` and Its Containing-Block Gotchas

`position: sticky` is a hybrid: the element behaves like `relative` (in flow, reserving its space) until its scroll position crosses a threshold you define with an offset (commonly `top`), at which point it behaves like `fixed` *within the bounds of its nearest scrolling ancestor* — it "sticks" to that edge and scrolls away again only once its containing block's bounds are exhausted.

```css
.sticky-header {
  position: sticky;
  top: 0; /* required — without an offset, sticky behaves exactly like relative and never sticks */
}
```

## The three requirements, and how each one silently breaks `sticky`

### 1. You must set an offset (`top`, `bottom`, `left`, or `right`)

Without at least one offset, the browser has no threshold to stick at, so the element just behaves like `position: relative`. This is the single most common "my sticky isn't working" bug — someone sets `position: sticky` and nothing else.

### 2. No ancestor between the element and its scroll container may have `overflow` set to anything other than `visible`

This is the second most common gotcha, and it's non-obvious because the `overflow` doesn't have to be on the *direct* parent — it can be on any ancestor up the chain, and it doesn't have to be `hidden`; `overflow: auto`, `scroll`, or even `clip` on an ancestor all break stickiness for *that* ancestor's scroll box (the sticky element becomes trapped by that ancestor's own scrolling area instead of the page's). If you truly need overflow clipping on that ancestor, you generally can't also have `sticky` cross that boundary — the two features are fundamentally in tension.

```css
.container {
  overflow: hidden; /* or auto, or scroll, or clip — any of these break sticky */
}
.container .sticky-child {
  position: sticky;
  top: 0; /* now sticks (if at all) relative to .container's own scrollable box, not the page */
}
```

Worth being precise here: `overflow: hidden` doesn't always look "broken" — sometimes it just changes *what* the element sticks relative to (its nearest scrolling ancestor instead of the viewport), which can look correct in a tall container but fail the moment that container's own height is short.

### 3. The element's containing block must be taller than the element itself

`sticky` sticks *within* its containing block. If the parent is exactly the same height as the sticky child (e.g. a `<div>` that wraps only a sticky nav bar with no extra height), there's no room for the element to "travel" before its container's bounds run out — it will appear to never move, because it's already at both the start and end of its available stick range in the same instant.

```css
/* This will not visibly stick — parent has zero extra height beyond the child */
.wrapper {
  height: fit-content; /* exactly as tall as .sticky-item */
}
.wrapper .sticky-item {
  position: sticky;
  top: 0;
}
```

## What `sticky` sticks *relative to*

The offset (e.g. `top: 0`) is measured against the padding edge of the **nearest ancestor with a scrolling mechanism** (an ancestor that establishes a scroll container — typically the nearest ancestor with `overflow` other than `visible`, or the viewport if none exists). It stops sticking once it reaches the far edge of its own containing block (i.e., once its parent scrolls out of view, the sticky child scrolls away with it, since it can never stick past the boundary of its own parent).

## Quick checklist when `sticky` "isn't working"

1. Is an offset (`top`/`bottom`/etc.) actually set?
2. Does any ancestor between the sticky element and the scrolling viewport/container have `overflow` other than `visible`?
3. Is the sticky element's direct parent tall enough to give it room to stick?
4. (Less common) Is the element inside a `display: flex`/`grid` container where the parent's own `overflow` or `min-height: auto` default is clipping things unexpectedly?
