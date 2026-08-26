*** copy 06-svg-inline-vs-external-and-canvas-basics.md ***

# SVG: Inline vs. External, and Canvas Basics

## Three ways to use SVG

| Method | Example | Styleable via external CSS? | Accessible? | Cacheable across pages? |
|---|---|---|---|---|
| Inline `<svg>` in HTML | `<svg><circle .../></svg>` directly in the markup | Yes — full CSS/JS access to individual internal elements | Yes, with proper `role`/`aria-label`/`<title>` | No — duplicated in every page's HTML |
| `<img src="icon.svg">` | Referenced like a raster image | No — internal SVG elements are opaque to the page's CSS | Via `alt` on the `<img>`, but no finer-grained internal accessibility | Yes — browser caches the file normally |
| CSS `background-image: url(icon.svg)` | Used purely as a decorative background | No | No — invisible to the accessibility tree entirely (same as any CSS background) | Yes |

## Inline SVG — when you need CSS/JS control over internals

```html
<svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Star rating icon">
  <path class="star-fill" d="M12 2l3.09 6.26L22 9.27l-5 4.87..." />
</svg>
```

```css
.star-fill { fill: #ccc; }
.rated .star-fill { fill: gold; } /* only possible because the SVG's internal elements are real DOM nodes */
```

Inline SVG is the only option when you need to style/animate/manipulate individual parts of the graphic from your page's own CSS or JavaScript (e.g. a multi-state icon, a chart with hover-interactive segments) — once referenced via `<img>` or a CSS background, the SVG's internals become an opaque black box to the embedding page.

## `<img src="*.svg">` — when it's just a static icon

```html
<img src="logo.svg" alt="Company logo" width="120" height="40">
```

Simpler, cacheable, and behaves exactly like any other `<img>` (supports `srcset`, `loading="lazy"`, etc.) — the right default choice for static logos/icons that don't need dynamic internal styling.

## SVG accessibility essentials

```html
<!-- Meaningful/informational SVG: needs an accessible name -->
<svg role="img" aria-label="4.5 out of 5 stars">...</svg>

<!-- Purely decorative SVG (accompanied by adjacent real text): hide it from AT -->
<svg aria-hidden="true" focusable="false">...</svg>
```

Without `role="img"` plus a name (`aria-label` or an internal `<title>` element referenced via `aria-labelledby`), a screen reader may announce individual internal SVG elements piecemeal (or nothing at all, depending on the browser/AT combination) rather than treating the graphic as one coherent, named image — the same "every interactive/informational element needs an accessible name" principle from the accessibility-aria topic applies here.

## Canvas basics

`<canvas>` is a raster drawing surface controlled entirely via JavaScript (the Canvas 2D API, or WebGL for 3D) — unlike SVG, it has **no DOM representation of what's drawn**; the browser only knows "pixels were painted here," with zero built-in accessibility, no CSS styling of individual shapes, and no way to inspect/select individual drawn elements after the fact.

```html
<canvas id="chart" width="400" height="200" role="img" aria-label="Bar chart of monthly sales">
  <!-- fallback content for browsers without canvas support, and a baseline for screen readers -->
  Monthly sales: January $12k, February $15k, March $18k.
</canvas>
```

```js
const ctx = document.getElementById('chart').getContext('2d');
ctx.fillStyle = '#3366ff';
ctx.fillRect(10, 10, 50, 150);
```

## When to choose canvas over SVG

| Use canvas when… | Use SVG when… |
|---|---|
| Rendering thousands of dynamic elements per frame (particle systems, real-time data viz with heavy redraw) — DOM/SVG element overhead becomes a real performance bottleneck at scale | Element count is moderate and individual pieces need to be styled/animated/interacted with as distinct objects |
| Pixel-level image manipulation (filters, image processing) | Accessibility and text-selectability of the content matter |
| Game rendering loops | Print/zoom quality matters (SVG is vector, infinitely scalable with no quality loss; canvas is raster, pixelated when scaled up) |

**Accessibility bottom line:** canvas content is invisible to assistive technology by default — any meaningful canvas-rendered content needs a manually maintained accessible fallback (as shown above, via `role="img"`/`aria-label` or descriptive fallback content inside the `<canvas>` tag), since there's no automatic way for a screen reader to interpret painted pixels.
