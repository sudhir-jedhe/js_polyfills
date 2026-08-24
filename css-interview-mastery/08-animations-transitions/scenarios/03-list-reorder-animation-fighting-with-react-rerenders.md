# Scenario: A List-Reorder Animation Fights with the Framework's Re-Renders

**Scenario:** A sortable list (e.g. drag-to-reorder, or items reordering after a sort/filter action) is meant to animate items smoothly sliding to their new positions. The team implemented this with CSS `transition` on each item's `top`/`left` (positioned via `position: absolute` with JS-calculated coordinates), but the animation is visually broken — items sometimes jump instantly without transitioning, sometimes transition from the wrong starting position, and the behavior is inconsistent depending on how many items reorder at once. The team suspects the framework (e.g. React) re-rendering is somehow "fighting" the CSS transition. What's actually happening, and how do you fix it?

**Diagnosis:**

There are two compounding problems here, and both are common in framework-driven list-reorder implementations:

1. **The framework's re-render can reset the DOM node's style before the browser gets a chance to paint the "old" position as a committed frame**, exactly like the modal fade-in scenario — if `top`/`left` go straight from old value to new value within a single render pass (no intermediate paint of the old position), the transition has nothing to animate away from, and the position just snaps.
2. **`top`/`left` are Layout-triggering properties**, so even when the transition *does* fire correctly, it's the expensive kind of animation — main-thread-bound, competing with whatever other rendering work the framework's re-render cycle is doing at the same time, which is exactly the kind of contention that produces inconsistent, load-dependent jank (worse when many items reorder simultaneously, since more elements are all triggering Layout work concurrently).

**Fix — this is the textbook use case for the FLIP technique (First, Last, Invert, Play), combined with switching to `transform` instead of `top`/`left`:**

```js
function animateReorder(items) {
  // FIRST: record each item's current (pre-reorder) position
  const firstRects = new Map(items.map((el) => [el, el.getBoundingClientRect()]));

  reorderDOMOrLayoutLogic(); // whatever actually causes the new order/positions

  // LAST: record each item's new (post-reorder) position
  items.forEach((el) => {
    const first = firstRects.get(el);
    const last = el.getBoundingClientRect();
    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;

    if (deltaX || deltaY) {
      // INVERT: instantly jump the item back to LOOK like it's still in its old spot,
      // using a transform (cheap, doesn't trigger layout) — no visible flash occurs
      // because this happens in the same frame as the real DOM reorder, before paint.
      el.style.transition = 'none';
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      requestAnimationFrame(() => {
        // PLAY: remove the inverted offset with a transition — the item animates
        // smoothly from its "fake old position" to its real new position.
        el.style.transition = 'transform 0.25s ease';
        el.style.transform = '';
      });
    }
  });
}
```

**Why FLIP solves both problems at once:** the "Invert" step uses `getBoundingClientRect()` measurements taken directly around the actual DOM reorder, guaranteeing the "old position" is captured precisely, regardless of how the framework's render cycle is batched — there's no reliance on the browser having painted an intermediate frame, since the inversion is computed mathematically from measured rects rather than depending on transition timing at all. And because the whole animation is expressed purely as a `transform: translate()` change (position delta, not `top`/`left`), the actual animated frames are compositor-only work — cheap, and unaffected by how much other Layout/render work the framework's re-render cycle is doing simultaneously, which directly fixes the "worse with more simultaneous items" symptom. FLIP is the standard, well-known technique specifically because it decouples "what actually changed in the DOM" (measured via rects, framework-agnostic) from "how the visual transition is expressed" (a cheap, compositor-friendly transform), sidestepping both of the underlying problems at once.
