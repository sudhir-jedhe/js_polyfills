# Performance: The Compositor Thread, and Cheap vs. Expensive Properties to Animate

This is the theory that separates "I can write an animation" from "I understand why my animation is janky" — and it's one of the most reliable ways interviewers probe for real depth on this topic.

## The rendering pipeline, briefly

When something on the page changes, the browser potentially has to run through several stages, in order, to produce the next visible frame:

1. **Style** — recalculate which CSS rules apply and what the computed values are.
2. **Layout (a.k.a. reflow)** — recalculate the geometry (position, size) of affected elements, and potentially their siblings/ancestors/descendants, since a size change can ripple outward.
3. **Paint** — rasterize the actual pixels (colors, shadows, borders, text) for each element into layers.
4. **Composite** — combine all the painted layers together into the final image shown on screen, applying any transforms/opacity for layers that were promoted to their own compositor layer.

Layout and Paint are expensive, main-thread-bound operations. Composite, critically, can happen on a **separate compositor thread**, independent of the main JS thread — which matters enormously for animation smoothness, because the main thread is frequently busy running JavaScript, handling events, or doing other layout/paint work, and if it's busy, main-thread-bound animation work stutters/drops frames along with it.

## Why `transform` and `opacity` are the "cheap" properties

Animating `transform` (translate/scale/rotate) or `opacity` can, in the best case, skip Layout *and* Paint entirely — the browser can promote the animated element to its own compositor layer once, and then every subsequent animation frame is purely a Composite-stage operation (repositioning/refading an already-painted layer), handled on the compositor thread. This is what makes `transform`/`opacity` animations capable of a smooth, consistent 60fps (or higher, on high-refresh displays) even while the main thread is busy doing other work — the animation literally doesn't need the main thread to keep progressing frame to frame.

```css
/* Cheap: skips layout and paint, runs on the compositor thread */
.card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.card:hover {
  transform: translateY(-4px) scale(1.02);
  opacity: 0.95;
}
```

## Why most other properties are "expensive"

```css
/* Expensive: triggers Layout on every frame */
.card {
  transition: width 0.2s ease, top 0.2s ease, margin-left 0.2s ease;
}
.card:hover {
  width: 320px;
  top: 10px;
  margin-left: 20px;
}
```

Properties like `width`, `height`, `top`/`left`/`right`/`bottom` (when not compensated for by `transform`), `margin`, `padding`, and anything else that can change an element's geometry force the browser to re-run **Layout** on every single animation frame (since the element's size/position genuinely changed, and that can affect the position of siblings and ancestors too), followed by **Paint**, followed by **Composite** — none of that work can be offloaded to the compositor thread alone, since Layout and Paint are inherently main-thread operations. Even properties that don't affect geometry but do affect visual pixels — `background-color`, `box-shadow`, `border-color` — still require a repaint on every frame (skipping Layout, but not Paint), which is cheaper than a full layout-triggering animation but still meaningfully more expensive than a pure transform/opacity composite-only animation.

## The practical rule of thumb

> Prefer animating `transform` and `opacity`. If you need to animate a position or size change, express it as a `transform: translate(...)`/`scale(...)` instead of `top`/`left`/`width`/`height` wherever the visual result can be equivalent.

```css
/* Instead of animating top/left (Layout-triggering)... */
.tooltip { top: 0; left: 0; transition: top 0.2s, left 0.2s; }
.tooltip.moved { top: 20px; left: 40px; }

/* ...animate transform (compositor-only) for the same visual effect */
.tooltip { transform: translate(0, 0); transition: transform 0.2s; }
.tooltip.moved { transform: translate(40px, 20px); }
```

## Categorization table

| Category | Examples | Pipeline stages triggered |
|---|---|---|
| Cheap (compositor-only) | `transform`, `opacity` (and `filter`, in most modern browsers) | Composite only |
| Paint-only (moderate cost) | `background-color`, `box-shadow`, `border-color`, `color` | Paint + Composite |
| Layout-triggering (expensive) | `width`, `height`, `top`/`left`/`right`/`bottom`, `margin`, `padding`, `font-size` | Layout + Paint + Composite |

This exact distinction is also why DevTools' Performance panel and "Rendering" tab (paint flashing, layout shift regions) are the standard tools for diagnosing a janky animation — they show directly which stage(s) are being triggered repeatedly during the animation.
