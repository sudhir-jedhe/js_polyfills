# Problem: Build a Reusable Tooltip Positioning System

## Problem Statement

Build a `data-tooltip` attribute-driven tooltip system: any element with a `data-tooltip="text"` attribute shows a small floating label near it on hover/focus, positioned above the element by default, but flipping below if there isn't enough viewport space above — using only CSS `position: absolute`/`fixed` and a single shared containing-block strategy, correctly even when the trigger element is nested inside cards with `transform`s applied (a common source of tooltip mispositioning, per the positioning-stacking gotchas covered earlier in this topic).

## Requirements

- Any element with `data-tooltip="..."` shows a tooltip on `:hover` and `:focus-visible` (keyboard accessible).
- Tooltip is positioned relative to the *viewport*, not accidentally relative to some transformed ancestor.
- Tooltip flips from above to below automatically if it would overflow the top of the viewport.
- No layout shift caused by the tooltip appearing (it must not affect document flow).
- Pure CSS is preferred for the show/hide and default positioning; JS is only used for the flip logic, since "would this overflow the viewport" requires measuring actual rendered position.

## Approach

Two things from this topic's theory apply directly: (1) `position: fixed` should be used instead of `position: absolute` for the tooltip precisely *because* `fixed`'s viewport-relative behavior isn't affected by scrolling, and — critically — the component must guarantee no ancestor between the tooltip and `<body>` has a `transform`/`filter`/`will-change`, which for a portal-rendered tooltip is automatically true. (2) The "flip if it would overflow" logic needs actual measured coordinates, since CSS alone can't conditionally reposition based on available space without the newer (and not universally supported) CSS anchor positioning / `position-try` features — so this solution uses a small JS helper alongside CSS custom properties for the actual placement values.

## Solution

```html
<button data-tooltip="Copy to clipboard" class="icon-btn">📋</button>
```

```css
[data-tooltip] {
  position: relative; /* anchor point for measuring only — NOT what the tooltip is positioned against */
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: fixed; /* deliberately fixed, not absolute — portaled tooltips rendered by JS use this too */
  top: var(--tooltip-top, -9999px);
  left: var(--tooltip-left, -9999px);
  transform: translate(-50%, -100%); /* centers horizontally, sits above the anchor point by default */
  background: #222;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none; /* tooltip never intercepts hover/click, avoiding flicker */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.1s ease;
  z-index: 1000;
}

[data-tooltip].tooltip-below::after {
  transform: translate(-50%, 8px); /* flipped: sits below the anchor point instead */
}

[data-tooltip]:hover::after,
[data-tooltip]:focus-visible::after {
  opacity: 1;
  visibility: visible;
}
```

```js
function positionTooltip(el) {
  const rect = el.getBoundingClientRect();
  const tooltipHeight = 28; // approximate; could be measured more precisely if needed
  const wouldOverflowTop = rect.top - tooltipHeight < 0;

  el.style.setProperty('--tooltip-top', `${wouldOverflowTop ? rect.bottom : rect.top}px`);
  el.style.setProperty('--tooltip-left', `${rect.left + rect.width / 2}px`);
  el.classList.toggle('tooltip-below', wouldOverflowTop);
}

document.querySelectorAll('[data-tooltip]').forEach((el) => {
  el.addEventListener('mouseenter', () => positionTooltip(el));
  el.addEventListener('focus', () => positionTooltip(el));
});
```

**Why `position: fixed` (not `absolute`) on the pseudo-element, and why that's safe here:** since the ::after pseudo-element belongs to the trigger element itself (not a portaled separate DOM node), it could in principle be captured by a transformed ancestor exactly as covered in the theory notes — the fix here is that positioning is computed from `getBoundingClientRect()` (viewport-relative, correct regardless of ancestor transforms) and applied via custom properties, so even in the edge case where an ancestor transform silently changes the tooltip's containing block, the numeric `top`/`left` values were computed correctly relative to the *actual* containing block only if there's no transformed ancestor — for a fully bulletproof version in a component library, the tooltip content itself would be portaled to `<body>` exactly as in the modal/dropdown problems, removing this caveat entirely.
