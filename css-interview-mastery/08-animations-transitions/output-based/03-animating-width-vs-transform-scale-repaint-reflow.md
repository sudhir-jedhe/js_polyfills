# Which Rendering Stages Does Each Animation Trigger?

```css
.box-a {
  width: 100px;
  transition: width 0.3s ease;
}
.box-a:hover {
  width: 200px;
}

.box-b {
  transform: scaleX(1);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.box-b:hover {
  transform: scaleX(2);
}
```

**Question:** `.box-a` and `.box-b` both visually double in horizontal size on hover. From a rendering-pipeline perspective, what's the meaningful difference between the two approaches, and which one is generally preferred for animation smoothness?

**Answer:** `.box-a`'s `width` transition triggers Layout (reflow) and Paint on every animation frame, in addition to Composite. `.box-b`'s `transform: scaleX()` transition can, in the typical case, skip Layout and Paint entirely and run purely on the Composite stage, via the compositor thread. `.box-b`'s approach is generally preferred for animation smoothness.

**Why:** `width` is a geometry-affecting property — changing it forces the browser to recompute the box's actual layout (and potentially the layout of siblings/ancestors that depend on this element's size), then repaint the affected pixels, on every single frame of the transition. This work is bound to the main thread and competes with any other JS/layout/paint work happening at the same time, which is exactly the kind of work that causes dropped frames/jank if the main thread gets busy mid-animation. `transform: scaleX()`, by contrast, doesn't change the element's actual layout box at all — it only changes how an already-painted layer is visually presented (stretched) during compositing, which the browser can typically handle entirely on a separate compositor thread, independent of main-thread congestion, yielding a much more consistently smooth result. The key practical takeaway: whenever a "grow/shrink/move" visual effect can be achieved equivalently with `transform` instead of a geometry property like `width`/`height`/`top`/`left`, the `transform` version is very likely to animate more smoothly, especially under load.
