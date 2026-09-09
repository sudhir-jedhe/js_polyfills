***  03-svg-canvas-object-fit-qa.md ***

# Interview Q&A — SVG, Canvas, and `object-fit`

**Q: What's the practical difference between inline SVG and `<img src="icon.svg">`?**
Inline SVG exposes every internal element as a real DOM node, fully stylable/animatable via the page's own CSS and JS. `<img src="icon.svg">` treats the SVG as an opaque external resource — you can size/position the whole image but can't style its internal paths, though you gain normal browser caching and native `srcset`/`loading` support that inline SVG doesn't have.

**Q: Why is `<canvas>` a poor choice for a static icon system?**
Canvas has no DOM representation of what's drawn — zero built-in accessibility, no CSS control over individual shapes, and no browser-native file caching. It's the right tool for high-volume dynamic rendering (real-time charts, games), not simple, mostly-static vector graphics, which is exactly what SVG already handles well.

**Q: What does `object-fit: cover` do, and how is it different from `contain`?**
`cover` scales an image/video to completely fill its box while preserving aspect ratio, cropping whatever overflows — no empty space, but part of the source may be cut off. `contain` scales to fit entirely within the box while preserving aspect ratio, potentially leaving empty letterboxed/pillarboxed space, but nothing from the source is ever cropped.

**Q: Why do `object-fit`/`object-position` only apply to certain elements?**
They only have visible effect on **replaced elements** (`<img>`, `<video>`, and similar) — elements whose rendered content comes from an external resource with its own intrinsic size/aspect ratio. Applying them to a regular element like `<div>` has no effect, since there's no "replaced content" with its own intrinsic dimensions to fit/position.

**Q: When would you choose a CSS `background-image` over an `<img>` tag for a photo?**
Only when the image is purely decorative with no informational content of its own — a CSS background image is invisible to the accessibility tree and isn't indexed as real content by search engines, unlike a real `<img>` with meaningful `alt` text. Any image that conveys actual information belongs in an `<img>` tag.

**Q: How do you make canvas-rendered content accessible to screen reader users?**
Provide a manually-maintained accessible fallback, since canvas content has no automatic DOM/AT representation: either `role="img"` plus `aria-label` describing the rendered content, or meaningful fallback content placed inside the `<canvas>` tag (only rendered/announced by browsers/AT that don't support canvas, or in some cases surfaced as the accessible description).
