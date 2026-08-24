# Scenario: Modal's Fade-In Animation Doesn't Play the First Time It Opens

**Scenario:** A modal component is conditionally rendered — it doesn't exist in the DOM at all until the user opens it, at which point it's mounted with a CSS class intended to trigger a fade/scale-in transition. On the very first open, the modal just appears instantly, with no animation. On subsequent opens (if the modal is closed and reopened without fully unmounting/remounting), the animation sometimes works. What's going on, and how do you fix it reliably?

**Diagnosis:**

This is the classic "transition on mount" problem. A CSS transition requires the browser to have already rendered/committed an element in its *starting* state before a change to its *ending* state can be observed and animated — but if the element is mounted into the DOM with both its starting styles (e.g. `opacity: 0; transform: scale(0.95);`) and the "trigger" class (e.g. `.is-open`, which sets `opacity: 1; transform: scale(1);`) applied essentially simultaneously, in the same initial render/paint cycle, there's no "before" frame for the transition to animate away from — the browser just paints the final state directly on first appearance. This is exactly why it's inconsistent between first-open and later-opens in many real implementations: if the component framework happens to batch the initial mount and the "open" class addition into the same render pass on first mount, but a later toggle (closing and reopening without a full unmount) goes through a genuinely separate render cycle, the timing differs enough that the animation sometimes "accidentally" works on reopens but not on the true first mount.

**Fix — force the starting state to be committed to a rendered frame before applying the trigger class:**

```js
function openModal(modalEl) {
  modalEl.classList.add('modal--mounted'); // sets the STARTING styles (opacity: 0, scale(0.95))
  document.body.appendChild(modalEl);       // actually insert into the DOM

  // Force the browser to commit a frame with the starting styles BEFORE
  // adding the class that triggers the transition to the ending styles.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modalEl.classList.add('is-open'); // NOW trigger the transition
    });
  });
}
```

```css
.modal--mounted {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.modal--mounted.is-open {
  opacity: 1;
  transform: scale(1);
}
```

**Why a double `requestAnimationFrame`, not just one:** a single `requestAnimationFrame` callback runs before the browser's next paint, but depending on exactly when in the frame lifecycle the style change was applied, one `rAF` isn't always guaranteed to have allowed the browser to actually commit and paint the starting styles first in every browser/engine — nesting a second `rAF` inside the first is a widely used, more reliable pattern to guarantee at least one real paint of the starting state has occurred before the triggering class is applied. (Framework-specific solutions exist too — e.g. React's `useLayoutEffect` combined with a two-step state update, or dedicated animation libraries/transition-group utilities that handle this timing internally — but the underlying problem being solved is identical regardless of the tooling.)

**A simpler alternative for many cases:** if the modal's starting state can instead be expressed via `@starting-style` (a newer CSS feature designed specifically to solve this exact "entry transition" problem declaratively) or via a CSS `animation` (which, unlike `transition`, *does* play automatically from its `from` keyframe on mount, without needing a manually-forced "before" frame), the JS timing workaround can be avoided entirely — worth knowing as an alternative, though the double-`rAF` transition pattern remains extremely common in real codebases and is the answer most interviewers are looking for.
