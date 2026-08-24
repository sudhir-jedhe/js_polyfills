# Problem: Build a Modal with Guaranteed-Correct Stacking

## Problem Statement

Build a modal dialog component (overlay backdrop + centered content box) that is guaranteed to render above *any* other content on the page — including content wrapped in components that might apply `transform`, `filter`, `opacity`, or their own `z-index`/stacking context — without needing to coordinate `z-index` values with the rest of the application.

## Requirements

- A full-viewport semi-transparent backdrop that dims the rest of the page.
- A centered content box above the backdrop.
- Clicking the backdrop closes the modal; clicking the content box does not.
- The modal must never be visually trapped behind other page content, regardless of what CSS those other components use, and without a global `z-index` registry/convention.
- Background page content must not be scrollable while the modal is open.

## Approach

The only fix that's structurally guaranteed to work regardless of what any other component on the page does is rendering the modal **outside the normal component tree**, as a direct child of `<body>` (a "portal"). This sidesteps both classic traps at once: it can't be capped by an ancestor's stacking context (because it has no such ancestor beyond `<body>`), and it can't be clipped by an ancestor's `overflow: hidden` (same reason). A single high `z-index` on the portal root is then sufficient, since it only ever needs to compete against other top-level, body-child elements.

## Solution

```html
<body>
  <div id="app"><!-- rest of the application --></div>
  <div id="modal-root"></div> <!-- portal target, sibling of #app, not nested inside it -->
</body>
```

```js
// React example — same principle applies with vanilla JS + appendChild
function Modal({ onClose, children }) {
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

```css
#modal-root {
  position: relative;
  z-index: 1000; /* only competing against #app's top-level rank, both being direct <body> children */
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 480px;
  width: 90%;
}

/* Applied to <body> (or <html>) via JS while the modal is open */
body.modal-open {
  overflow: hidden; /* prevents background scroll without affecting the modal, which lives outside the scrolling content */
}
```

**Why this is robust and a purely-`z-index`-based fix isn't:** if the modal were instead rendered inline inside whatever component happened to open it, its correctness would depend on *every* ancestor, forever, never introducing `transform`/`filter`/`opacity`/`overflow` — a guarantee no single component author can make about the rest of a large, evolving codebase. Moving it outside the tree removes the dependency entirely: `#modal-root`'s `z-index` only ever has to out-rank `#app`, a single, stable, one-time comparison.
