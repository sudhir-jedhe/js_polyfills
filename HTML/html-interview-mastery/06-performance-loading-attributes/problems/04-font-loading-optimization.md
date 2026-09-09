***  04-font-loading-optimization.md ***

# Problem: Eliminate Flash of Invisible Text for a Self-Hosted Font

## Problem Statement

Given a page that self-hosts a variable web font (`inter-var.woff2`, referenced from a CSS file), write the complete `<head>` markup and CSS needed to: (a) eliminate any invisible-text flash, and (b) start fetching the actual font file as early as technically possible, without inlining the entire stylesheet.

## Requirements

- The font file must start downloading as early as the HTML parser can discover it — not only after the CSS file that references it has been fetched and parsed.
- Text must never render invisible while waiting for the font — a fallback font must show immediately.
- The stylesheet itself (`styles.css`, containing the `@font-face` rule and everything else) should remain a normal, separate file — not inlined.
- Avoid over-hinting: only the resources that genuinely need a hint should get one.

## Approach

Two independent techniques, applied together: `rel="preload"` on the font file itself (so its fetch starts immediately, in parallel with `styles.css`, rather than waiting to be discovered from inside it), and `font-display: swap` inside the `@font-face` rule (so the browser shows fallback text immediately rather than blocking text rendering during the font's load window). Since the font is self-hosted on the same origin as the page, no `preconnect` is needed (there's no separate origin's connection to warm up) — that hint is reserved for cross-origin resources.

## Solution

```html
<head>
  <!-- Preload the actual font file: starts its fetch immediately, in parallel
       with styles.css, instead of only being discovered once styles.css is
       fetched AND parsed far enough to reach the @font-face rule -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

  <link rel="stylesheet" href="/styles/styles.css">
</head>
```

```css
/* styles.css */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2-variations');
  font-weight: 100 900; /* variable font weight range */
  font-display: swap;   /* fallback text shows immediately, swaps in once the font loads */
}

body {
  font-family: 'Inter', system-ui, sans-serif; /* explicit fallback stack */
}
```

**Why `crossorigin` is required on the font `preload` even though it's same-origin:** Font requests are always made in "anonymous" CORS mode per the Fetch specification, regardless of same- or cross-origin status — omitting `crossorigin` on the `preload` link causes the browser to treat it as a *different* request mode from the actual font fetch triggered by `@font-face`, so it fails to match them and fetches the font twice, exactly the double-fetch problem covered in this topic's `preload`-mismatch output-based question.

**Why `preconnect` is deliberately omitted here:** The font is self-hosted on the same origin as the page itself, so there's no separate DNS/TCP/TLS handshake to warm up in the first place — the connection to the page's own origin is already being established regardless. Adding a `preconnect` to the page's own origin would be a no-op at best, which is why over-hinting (applying every available hint regardless of whether it's needed) is called out as something to avoid.

**Why `font-weight: 100 900` matters for a variable font specifically:** Without declaring the weight range the variable font file actually supports, the browser may fall back to treating it as a single static weight, causing bold/light text to be synthetically faked (fake-bold via stretching) rather than using the font's own genuine variable-weight glyphs — a correctness detail distinct from, but often asked alongside, the loading-performance question.
