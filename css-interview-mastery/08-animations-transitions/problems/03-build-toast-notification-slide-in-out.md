# Problem: Build a Toast Notification with Slide-In/Slide-Out Animations

## Problem Statement

Build a toast notification system: toasts slide in from the bottom-right corner, remain visible for a few seconds, then slide back out and are removed from the DOM — all using compositor-cheap properties, correctly handling the "enter transition doesn't play on mount" problem, and correctly removing the DOM node only after the exit animation has actually finished (not before, which would cut the animation off instantly).

## Requirements

- Toasts appear via `transform`/`opacity` transitions (slide + fade), not `top`/`left`.
- The entrance transition must reliably play every time a new toast is added (not silently skip on the very first toast, per the "transition on mount" trap).
- After a delay, the toast slides/fades back out, and is only removed from the DOM once that exit animation has genuinely completed.
- Multiple toasts can stack, each independently entering/exiting on its own timeline.

## Approach

Use the mount-then-force-a-frame-then-trigger pattern (via a double `requestAnimationFrame`) to guarantee the entrance transition reliably plays, and use the `transitionend` event (rather than a fixed `setTimeout` matching the CSS duration, which is fragile and easy to let drift out of sync with the actual CSS) to know precisely when it's safe to remove the DOM node after the exit transition.

## Solution

```html
<div class="toast-container" id="toast-container"></div>
```

```css
.toast-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.toast {
  background: #1f2937;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.2);

  transform: translateX(120%);
  opacity: 0;
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}

.toast.is-visible {
  transform: translateX(0);
  opacity: 1;
}
```

```js
const container = document.getElementById('toast-container');

function showToast(message, durationMs = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  // Force a committed "before" frame (starting styles: translateX(120%), opacity: 0)
  // before triggering the entrance transition — see the modal fade-in scenario for
  // why a single rAF isn't always sufficient across browsers.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });
  });

  setTimeout(() => dismissToast(toast), durationMs);
}

function dismissToast(toast) {
  toast.classList.remove('is-visible'); // triggers the exit transition back to the starting styles

  toast.addEventListener(
    'transitionend',
    () => {
      toast.remove(); // only removed from the DOM once the exit animation has genuinely finished
    },
    { once: true }
  );
}
```

**Why `transitionend`, and not a `setTimeout` matching the CSS duration, to decide when to remove the toast:** hardcoding a matching `setTimeout(..., 250)` duplicates the `0.25s` value across both CSS and JS, and the two are easy to let drift out of sync if either is changed later without remembering to update the other — `transitionend` fires exactly when the browser has actually finished the transition, so it's automatically correct regardless of what duration the CSS specifies, with no duplicated magic number to maintain.

**Why `transitionend` needs `{ once: true }` (or equivalent cleanup) here specifically:** `transitionend` fires once per transitioning property, and this toast transitions two properties (`transform` and `opacity`) simultaneously — without `{ once: true }`, the listener callback would fire twice for a single dismissal (once when each property's transition completes), which for `toast.remove()` is harmless (removing an already-removed node is a no-op) but is still worth handling deliberately rather than relying on that being harmless by accident, especially if the callback ever grows to do something that isn't safely idempotent.
