# Scenario: An Accordion's Expand/Collapse Transition Is Janky and Causes Layout Shift

**Scenario:** An accordion component expands/collapses a content panel by transitioning `height` from `0` to `auto` (or a fixed pixel value). QA reports the animation stutters noticeably, especially on lower-end devices, and other content below the accordion visibly jumps/reflows during the animation rather than moving smoothly. How do you diagnose and fix this?

**Diagnosis:**

Animating `height` is a textbook Layout-triggering property change — on every single frame of the transition, the browser has to recompute the accordion panel's geometry, which in turn affects the position of every element below it in normal flow (they have to shift down as the panel grows, and shift back up as it shrinks). This means every frame does real Layout work, followed by Paint, followed by Composite — none of it can be offloaded to the compositor thread — which is exactly the kind of expensive, main-thread-bound animation that stutters under any additional load (other JS running, other paint work, a slower device's CPU). The "layout shift" QA is describing isn't a bug exactly — it's the *correct and expected* consequence of animating `height`, since content below genuinely does need to reflow as the panel's real size changes — but the *janky, stuttering* quality of that reflow is the actual performance problem worth fixing.

**Fix — there are two common, valid approaches depending on constraints:**

**Option 1: Animate `max-height` instead, if a reasonable upper bound is knowable.** This is a common workaround, but worth noting it doesn't fully solve the underlying cost — `max-height` is still a geometry-affecting property and still triggers Layout per frame; it mainly solves the *different* problem of not being able to transition to/from `auto` (transitions can't interpolate to/from `auto` directly, since `auto`'s actual resolved value isn't known until layout runs). It doesn't fix the Layout-triggering performance cost itself.

```css
.panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.panel.is-open {
  max-height: 500px; /* must exceed the tallest realistic content height */
}
```

**Option 2 (preferred where achievable): use the Web Animations API / a measured pixel height with `requestAnimationFrame`, or restructure to a `transform`-based reveal.** For a case where content genuinely needs to push surrounding layout (which an accordion does, by definition), there's no way to make the *reflow itself* free — but you can still improve smoothness meaningfully by measuring the panel's natural height once via JS (`scrollHeight`), then animating between `0` and that exact measured pixel value (avoiding the `max-height` overshoot problem, where animating to a `max-height` far larger than the actual content makes the animation's perceived speed non-uniform, since most of the transition duration is spent animating through empty overshoot space).

```js
function toggleAccordion(panel, isOpening) {
  const targetHeight = panel.scrollHeight; // measure the real content height
  panel.style.height = isOpening ? '0px' : `${targetHeight}px`;
  requestAnimationFrame(() => {
    panel.style.height = isOpening ? `${targetHeight}px` : '0px';
  });
}
```

```css
.panel {
  overflow: hidden;
  transition: height 0.3s ease;
}
```

**Where this leaves the performance question honestly:** for a true accordion (content that must actually push surrounding elements down/up), there's no way to entirely avoid Layout cost, since real space genuinely needs to be reflowed — the fix here is about making the *cost proportional and predictable* (using the real measured height rather than an arbitrary oversized `max-height`) rather than eliminating Layout entirely. For cases where content *doesn't* strictly need to push siblings (e.g. an overlay-style reveal, a tooltip, a modal), switching to `transform`/`opacity`-based reveals (see the compositor-thread theory notes) avoids the Layout cost altogether — the key diagnostic question is always "does this element's size change genuinely need to move other content, or can the same visual effect be achieved without actually changing layout geometry."
