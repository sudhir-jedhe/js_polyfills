***  04-keyboard-navigation-tabindex-focus.md ***

# Keyboard Navigation: `tabindex` and Focus Management

Every interactive control must be operable via keyboard alone (WCAG 2.1.1) — this is non-negotiable for anyone who can't use a mouse/trackpad/touchscreen (motor impairments, screen reader users who navigate primarily by keyboard, power users).

## `tabindex` values and what each means

| Value | Effect |
|---|---|
| (absent, on a naturally focusable element like `<button>`/`<a href>`/`<input>`) | Included in the natural tab order, in DOM order |
| `tabindex="0"` | Makes an otherwise non-focusable element (like a `<div>`) focusable and inserts it into the **natural** tab order (DOM order), at its position in the document |
| `tabindex="-1"` | Removes an element from the Tab-key sequence entirely, but still allows it to receive focus **programmatically** via `element.focus()` — used for things like a modal's heading, or a target for a skip link |
| `tabindex="1"` or higher (positive) | Forces the element to the **front** of the tab order, ahead of every `0`/default element, in ascending numeric order — **almost universally considered an anti-pattern** |

## Why positive `tabindex` values are almost always wrong

Positive values create a *second*, separate tab sequence that overrides natural DOM order — the moment there's more than one positive value on a page, or a positive value mixed with default-tabbable elements, the resulting tab order becomes disconnected from the visual/logical reading order, which is deeply disorienting for keyboard/screen reader users. The correct way to influence tab order is almost always to **reorder the actual DOM**, not to bolt on positive `tabindex` values.

## Focus management for dynamic UI

When content appears/disappears dynamically (modals, dropdowns, toasts), focus must be moved deliberately — the browser doesn't do this for you automatically.

```js
// opening a modal: move focus INTO it
function openModal(modalEl) {
  modalEl.hidden = false;
  const heading = modalEl.querySelector('h2');
  heading.setAttribute('tabindex', '-1'); // not naturally focusable, but valid focus() target
  heading.focus();
}

// closing a modal: return focus to whatever triggered it
function closeModal(modalEl, triggerEl) {
  modalEl.hidden = true;
  triggerEl.focus(); // WITHOUT this, focus is often lost entirely (falls back to <body>)
}
```

If focus isn't explicitly returned to the trigger element on close, many browsers reset focus to `<body>` — a screen reader or keyboard user then has to navigate from the very top of the page again to find where they were, a serious usability regression.

## Skip links

A skip link is the very first focusable element on the page, letting keyboard users bypass repeated navigation and jump straight to main content — without it, a keyboard user must Tab through every single nav link on every single page load before reaching the actual content.

```html
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header><nav><!-- 15 nav links --></nav></header>
  <main id="main-content" tabindex="-1">...</main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px; /* visually hidden off-screen by default */
  left: 0;
}
.skip-link:focus {
  top: 0; /* becomes visible the instant it receives keyboard focus */
}
```

The skip link should be visually hidden by default but **must become visible on focus** — hiding it permanently (e.g. `display: none`) removes it from the tab order entirely, defeating its purpose for the sighted-keyboard-user case, while a fully invisible-even-when-focused skip link leaves sighted keyboard users with no visual indication that pressing Tab actually did anything.

## Focus order vs. DOM order vs. visual order

These three should generally match. CSS (`order` in Flexbox/Grid, `position: absolute`) can visually reposition elements without changing their DOM/focus order — meaning a sighted keyboard user can see focus visually "jump" to a place that doesn't match their expected reading order, purely because CSS changed the *visual* position while the *focus* order followed the (unchanged) DOM. This is a common, easy-to-miss bug in CSS Grid layouts where `grid-column`/`grid-row` visually rearrange items independent of source order.
