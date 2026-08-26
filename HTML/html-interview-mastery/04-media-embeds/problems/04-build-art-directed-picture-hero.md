*** copy 04-build-art-directed-picture-hero.md ***

# Problem: Build an Art-Directed `<picture>` Hero with Format Fallback

## Problem Statement

Build a homepage hero image that: (1) shows a tighter portrait crop on mobile and a wide landscape crop on desktop (true art direction, not just resizing), and (2) within each crop, serves AVIF to browsers that support it, WebP as a second choice, and JPEG as the universal fallback. The whole thing must degrade gracefully to something reasonable even in a browser supporting none of the modern formats and none of the `<picture>` element itself.

## Constraints

- Breakpoint for art direction: mobile ≤ 700px uses the portrait crop; wider uses the landscape crop.
- Format preference order within each crop: AVIF → WebP → JPEG.
- Must supply real `alt` text and reserve aspect-ratio space.
- A browser with zero `<picture>` support must still show something reasonable (not a broken image icon).

## Solution

```html
<picture>
  <!-- Mobile portrait crop, format-preferred -->
  <source media="(max-width: 700px)" srcset="hero-portrait.avif" type="image/avif">
  <source media="(max-width: 700px)" srcset="hero-portrait.webp" type="image/webp">
  <source media="(max-width: 700px)" srcset="hero-portrait.jpg" type="image/jpeg">

  <!-- Desktop landscape crop, format-preferred -->
  <source media="(min-width: 701px)" srcset="hero-landscape.avif" type="image/avif">
  <source media="(min-width: 701px)" srcset="hero-landscape.webp" type="image/webp">

  <!-- Required fallback: also the ONLY thing a <picture>-unaware browser will render -->
  <img
    src="hero-landscape.jpg"
    alt="A team collaborating around a whiteboard covered in sticky notes"
    width="1600" height="900"
    fetchpriority="high">
</picture>
```

**Why this satisfies the constraints:**
- The `media` conditions establish the art-direction breakpoint (`≤700px` vs. `≥701px`), and within *each* breakpoint, multiple `<source>` entries with different `type` values let the browser pick its best-supported format — the browser evaluates sources top to bottom and uses the first one that's both `media`-matching AND `type`-supported, so ordering AVIF before WebP before JPEG within each breakpoint group correctly expresses the preference order.
- A browser with zero `<picture>`/`<source>` support (extremely rare today, but the mechanism is worth understanding) simply doesn't recognize `<source>` as meaningful and renders the child `<img>` directly, exactly as if the `<picture>`/`<source>` markup weren't there at all — this is why the fallback `<img>` must always be a fully valid, standalone, working `<img>` on its own, not just a formality.
- `alt` lives only on the `<img>`, applying uniformly regardless of which `<source>` (if any) was actually selected — describing the image's *meaning*, which stays consistent across crops/formats even though the pixels differ.
- `width="1600" height="900"` on the fallback `<img>` establishes the aspect ratio used for layout-space reservation; even though the portrait crop has different actual dimensions, using the eventual *landscape* fallback's ratio here is an accepted trade-off unless a more precise approach (e.g. CSS `aspect-ratio` overrides per breakpoint) is layered on top — worth noting in an interview as a known limitation of `width`/`height` reservation combined with true art-directed crops.
- `fetchpriority="high"` targets this specifically as the likely LCP element, mirroring the responsive-hero-image scenario elsewhere in this topic.
