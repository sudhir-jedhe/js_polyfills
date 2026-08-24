# Scenario: Choosing Between SVG, Canvas, and `<img>` for an Icon System

**Scenario:** You're setting up a design system's icon library (150+ icons: nav icons, status icons, a few animated loading spinners) used across a large product. One engineer suggests rendering everything through `<canvas>` for "consistent rendering." Another suggests just using `<img src="icon.svg">` everywhere for simplicity. Evaluate both and propose the right approach.

**Diagnosis of each proposal:**

**Canvas for icons — wrong tool.** Canvas has no DOM representation of what's drawn, meaning: zero built-in accessibility (every single icon would need manually-maintained fallback text with no automatic connection to what's actually drawn), no CSS control over color/size per-icon (color changes would require re-running draw calls, not a CSS `fill` change), and no browser-native caching/reuse the way an image file gets — all cost, no benefit, for content that's fundamentally simple 2D vector shapes, exactly what SVG already exists for. Canvas earns its place for high-volume dynamic rendering (charts with thousands of points, games) — a static icon set doesn't remotely reach that threshold.

**`<img src="icon.svg">` everywhere — workable but leaves value on the table.** This is simple and does have real benefits (browser caching, native `loading="lazy"`/`srcset` support, decent accessibility via `alt`), but it fails the moment any icon needs **state-driven styling** — a "like" icon that changes fill color when active, a nav icon that changes color on hover/focus purely via CSS without a second image request, or a loading spinner whose stroke color needs to inherit `currentColor` from surrounding text. None of that is possible once an SVG is referenced externally — its internals are opaque to the page's CSS.

**Recommended approach — inline SVG via a sprite/symbol system, not `<img>` for every icon:**

```html
<!-- One-time hidden sprite sheet, loaded once, cached, referenced everywhere -->
<svg style="display:none">
  <symbol id="icon-heart" viewBox="0 0 24 24">
    <path d="M12 21s-6.7-4.35-9.3-8.1..." />
  </symbol>
  <symbol id="icon-check" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </symbol>
</svg>

<!-- Usage: lightweight <use> reference, inherits CSS from its own wrapping context -->
<button class="like-btn" aria-pressed="false">
  <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-heart"/></svg>
  <span class="visually-hidden">Like</span>
</button>
```

```css
.icon { width: 20px; height: 20px; fill: currentColor; } /* inherits text color automatically, per instance */
.like-btn[aria-pressed="true"] .icon { color: #e0245e; } /* CSS-only state change, no new request, no canvas redraw */
```

**Why this is the right middle ground:** `<symbol>`/`<use>` gives every icon instance full CSS styling control (color inherits via `currentColor`, size is a simple CSS property) — the exact capability the `<img>`-only proposal loses — while defining each icon's path data exactly once in a single cached sprite sheet, avoiding the duplication cost of 150 individual fully-inline `<svg>` blocks scattered across every component. The few animated loading spinners are the one case where CSS `@keyframes` on the inline SVG (rotating a `<path>` or animating `stroke-dashoffset`) is trivial and requires zero canvas/JS animation-loop code at all.
