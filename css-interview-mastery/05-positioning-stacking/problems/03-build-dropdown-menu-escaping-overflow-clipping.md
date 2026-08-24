# Problem: Build a Dropdown Menu That Escapes Any Ancestor's `overflow: hidden`

## Problem Statement

Build a "select"-style dropdown trigger + menu component that correctly opens and positions itself near its trigger button, and is never visually clipped even when placed inside an ancestor with `overflow: hidden` (e.g. a card with rounded corners, or a horizontally scrollable carousel row).

## Requirements

- The trigger button toggles the menu open/closed.
- The menu is positioned directly below the trigger (or above, if there isn't room below the viewport edge).
- The menu is never clipped by any ancestor's `overflow` setting.
- The menu closes when clicking outside it.
- Works even if the trigger is inside a scrolling container (the menu should track the trigger's position, or close, on scroll).

## Approach

Because `overflow: hidden` clips descendants regardless of their `position` value, the only reliable fix is to render the menu outside the clipped ancestor's subtree (a portal to `document.body`), and compute its position in JavaScript using the trigger's `getBoundingClientRect()`, since it can no longer rely on a CSS-only `position: absolute` relative to a nearby wrapper.

## Solution

```html
<button id="trigger" aria-haspopup="listbox" aria-expanded="false">
  Choose an option
</button>
<!-- menu is portaled to the end of <body>, NOT nested under any clipped ancestor -->
```

```js
const trigger = document.getElementById('trigger');
let menuEl = null;

function openMenu() {
  const rect = trigger.getBoundingClientRect();
  menuEl = document.createElement('div');
  menuEl.className = 'dropdown-menu';
  menuEl.innerHTML = `<ul role="listbox">
    <li role="option">Option A</li>
    <li role="option">Option B</li>
    <li role="option">Option C</li>
  </ul>`;

  // Position using fixed coordinates from the trigger's viewport-relative rect —
  // position: fixed means these numbers are already correct regardless of any
  // ancestor's overflow or scroll offset, as long as no ancestor has a transform
  // (see the positioning theory notes on containing blocks for fixed elements).
  menuEl.style.position = 'fixed';
  menuEl.style.top = `${rect.bottom + 4}px`;
  menuEl.style.left = `${rect.left}px`;
  menuEl.style.minWidth = `${rect.width}px`;

  document.body.appendChild(menuEl);
  trigger.setAttribute('aria-expanded', 'true');

  document.addEventListener('click', handleOutsideClick, { capture: true });
  window.addEventListener('scroll', closeMenu, { capture: true, passive: true });
}

function closeMenu() {
  if (!menuEl) return;
  menuEl.remove();
  menuEl = null;
  trigger.setAttribute('aria-expanded', 'false');
  document.removeEventListener('click', handleOutsideClick, { capture: true });
  window.removeEventListener('scroll', closeMenu, { capture: true });
}

function handleOutsideClick(e) {
  if (menuEl && !menuEl.contains(e.target) && e.target !== trigger) closeMenu();
}

trigger.addEventListener('click', () => (menuEl ? closeMenu() : openMenu()));
```

```css
.dropdown-menu {
  z-index: 1000; /* only needs to out-rank other body-level content, same reasoning as the modal problem */
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  padding: 4px;
}
```

**Why `getBoundingClientRect()` + `position: fixed` instead of `position: absolute` relative to a wrapper:** once the menu is portaled to `<body>`, it's no longer near the trigger in the DOM, so a CSS-only anchor relationship (via a `position: relative` ancestor) isn't available. `getBoundingClientRect()` gives the trigger's coordinates relative to the viewport, which is exactly what `position: fixed` offsets are measured against (as long as no ancestor of the *portaled menu itself* — not the trigger — has a `transform`). Closing the menu on scroll (rather than repositioning it) is the simplest correct behavior for a portal-based menu that isn't re-measuring on every scroll frame; a fancier implementation could instead recompute `top`/`left` on scroll for a "menu follows trigger" effect.
