# Interview Q&A — `will-change` and Accessibility

**Q: What does `will-change` actually do?**
It's a hint telling the browser an element's given property is likely to change soon, allowing the browser to do preparatory optimization work ahead of time — most notably, promoting the element to its own compositor layer before the animation starts, rather than paying that layer-promotion cost mid-animation (which can otherwise cause a visible hitch on the animation's first frame).

**Q: Why is applying `will-change` broadly (e.g. to every element, or leaving it on permanently) considered an anti-pattern?**
Every element with an active `will-change` hint gets promoted to (and generally kept on) its own compositor layer, and layers aren't free — they consume GPU memory, and having many unnecessary layers increases compositing work per frame and memory pressure, which can actually hurt performance overall, especially on memory-constrained devices. Using it broadly/permanently "just in case," rather than narrowly and temporarily around an actual upcoming animation, defeats its purpose and can make things worse rather than better.

**Q: What's the recommended pattern for applying `will-change` correctly?**
Apply it shortly before the animation is expected to start (e.g. via a JS class toggle triggered by a user interaction like hovering near or clicking a trigger), and remove it shortly after the animation completes (e.g. on `transitionend`/`animationend`), rather than leaving it applied indefinitely.

**Q: Does `will-change` make an expensive, Layout-triggering animation (like animating `width`) cheap?**
No — `will-change` primarily helps with the layer-promotion cost for properties that are already compositor-eligible (`transform`, `opacity`). It doesn't change the fundamental cost of a property that requires Layout/Paint on every frame; it's not a substitute for choosing cheap properties to animate in the first place.

**Q: What is `prefers-reduced-motion`, and what does it detect?**
A CSS media feature that reflects a user's OS-level accessibility preference requesting reduced non-essential motion — commonly relevant for users with vestibular disorders who can experience real physical discomfort (dizziness, nausea) from large-scale animation, parallax, or auto-playing motion effects. It has two values: `reduce` and `no-preference`.

**Q: What's a reasonable baseline implementation for respecting `prefers-reduced-motion` across an entire site?**
A broad `@media (prefers-reduced-motion: reduce)` rule that forces near-instant animation/transition durations and a single iteration count on all elements (a low-effort safety net), ideally combined with more targeted, per-component fixes for the specific large-scale motion effects most likely to cause discomfort (parallax scrolling, auto-rotating carousels, zoom/scale effects tied to scroll position) — including disabling JS-driven behaviors like auto-advancing carousels, which CSS alone can't control.

**Q: Why might using an extremely short duration (e.g. `0.001ms`) be preferred over `animation: none`/`transition: none` when implementing a reduced-motion override?**
Forcibly setting `animation: none` can sometimes suppress `animationend`/`transitionend` events that other JS logic depends on firing (e.g. code that waits for a transition to finish before performing a follow-up action) — using a near-zero duration still fires those events (just almost instantly) while visually reading as effectively instant to the user, avoiding a secondary bug where dependent JS logic silently stops working under the reduced-motion setting.
