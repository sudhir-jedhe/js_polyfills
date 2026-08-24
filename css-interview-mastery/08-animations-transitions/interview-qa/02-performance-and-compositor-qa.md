# Interview Q&A — Performance & the Compositor Thread

**Q: Why are `transform` and `opacity` considered "cheap" to animate, compared to properties like `width` or `top`?**
Because animating `transform`/`opacity` can, in the typical case, skip the Layout and Paint stages of the rendering pipeline entirely — the browser promotes the element to its own compositor layer, and each subsequent animation frame is handled purely by the Composite stage, which can run on a separate compositor thread independent of the (often busy) main thread. `width`/`top`/`left`/`margin` and similar geometry-affecting properties force Layout (and then Paint) to re-run on every frame, which is main-thread-bound work that competes with any other JS/rendering work happening simultaneously.

**Q: What are the four main stages of the browser's rendering pipeline, in order?**
Style (recalculate applicable CSS rules/computed values), Layout/reflow (recalculate geometry — position and size), Paint (rasterize pixels into layers), and Composite (combine layers into the final displayed frame, potentially on a separate compositor thread).

**Q: If you need to visually move an element from one position to another, why is `transform: translate()` generally preferred over animating `top`/`left`?**
Because `transform: translate()` doesn't change the element's actual layout geometry at all — it only affects how an already-painted layer is positioned during compositing — so it can skip Layout and Paint entirely and run on the compositor thread. `top`/`left` changes are geometry changes, forcing Layout (and often Paint) to re-run on every frame, which is significantly more expensive and more prone to jank, especially when the main thread is also busy with other work.

**Q: Does animating `background-color` trigger Layout?**
No — `background-color` doesn't affect an element's geometry, so it doesn't trigger Layout. But it does still require a repaint on every frame (since the actual pixel colors are changing), so it's more expensive than a pure `transform`/`opacity` animation (which can skip Paint too), even though it's cheaper than a Layout-triggering property.

**Q: Why might `transition: all` be considered a bad practice, even if the actual animated result looks correct?**
It watches every animatable property on the element for changes, not just the ones intentionally meant to animate — this makes it easy for a later, unrelated code change to accidentally introduce an animated expensive property (like `width`) by omission, without anyone deliberately choosing to animate it, and it also means the browser has to actively check a broader set of properties for changes each frame rather than only the specific ones explicitly listed.

**Q: What tools would you use to actually diagnose whether an animation is triggering Layout/Paint unnecessarily?**
Browser DevTools' Performance panel (recording a trace during the animation and inspecting which stages — Layout, Paint, Composite — are firing on each frame), and the Rendering tab's paint-flashing overlay (which visually highlights regions being repainted), which together make it possible to confirm empirically whether a given animation is compositor-only or is triggering more expensive work than intended.
