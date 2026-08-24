# 08 — Image & Font Optimization

`next/image` and `next/font` remove two of the most common, highest-impact
performance footguns in web apps: unsized images causing layout shift and
slow/uncontrolled image delivery, and external font requests blocking text
paint (with a privacy cost on top, for Google Fonts specifically). This
topic covers both APIs in depth and ties them directly to Core Web Vitals —
LCP and CLS — rather than treating them as generic "best practices."

## Key takeaways

- `next/image` requires `width`/`height` (or `fill`) because it uses them to
  reserve the image's aspect ratio in the DOM before the bytes download —
  this is what structurally prevents Cumulative Layout Shift, not an
  optional nicety.
- Fixed, known dimensions → `width`/`height`. Responsive, container-driven
  dimensions → `fill`, which requires a positioned (`position: relative`),
  explicitly sized parent, plus a correctly configured `sizes` prop whenever
  the rendered width varies meaningfully by breakpoint or isn't full-viewport.
- `priority` disables lazy loading and adds a `<link rel="preload">` hint —
  reserve it for the actual LCP candidate (usually one hero image), not
  every image on the page; overusing it causes bandwidth contention that can
  regress LCP instead of improving it.
- Remote images require their hostname to be allow-listed in
  `next.config.js`'s `images.remotePatterns` — a very common "works with
  local test images, breaks against the real CDN/CMS" bug.
- `next/font` downloads Google/local fonts at build time and self-hosts
  them from your own origin, eliminating the render-blocking external font
  request and the IP-to-Google privacy cost of directly loading Google
  Fonts — for both Google and local/custom fonts via `next/font/google` and
  `next/font/local` respectively, usable together in the same layout.
- `next/font` also auto-calculates fallback-font metric matching to reduce
  the visible jump when a custom font swaps in, directly helping CLS in a
  way manual font loading doesn't do automatically.
- LCP is improved primarily by `priority` (image loads earlier) and
  self-hosted fonts (text isn't blocked on an external request); CLS is
  improved primarily by required image dimensions and font
  fallback-matching — know which lever addresses which metric.

## Index

### theory/
1. `01-next-image-fundamentals.md` — automatic resizing/format/lazy-loading, why `width`/`height` are mandatory.
2. `02-width-height-fill-and-sizes.md` — fixed-dimension vs. `fill` mode, correct `sizes` usage.
3. `03-priority-and-lcp.md` — what `priority` does, why over- and under-using it both hurt.
4. `04-next-font-google-and-local.md` — `next/font/google` and `next/font/local`, using both together.
5. `05-core-web-vitals-connection.md` — mapping image/font choices directly to LCP and CLS.

### snippets/
1. `01-basic-image-fixed-size.jsx` — fixed `width`/`height` avatar image.
2. `02-fill-with-sizes.jsx` — responsive `fill` image with `sizes`.
3. `03-priority-hero-image.jsx` — `priority` hero paired with default-lazy below-the-fold images.
4. `04-remote-image-config.js` — `next.config.js` `remotePatterns` setup.
5. `05-google-font-setup.jsx` — `next/font/google` in the root layout.
6. `06-local-font-setup.jsx` — `next/font/local` with multiple weights.
7. `07-google-and-local-font-together.jsx` — both font sources combined via CSS variables.

### output-based/
1. `01-missing-dimensions-build-error.md` — missing `width`/`height` throws, unlike a raw `<img>`.
2. `02-remote-hostname-not-configured.md` — unconfigured remote hostname rejected by the optimizer.
3. `03-every-image-marked-priority.md` — over-applying `priority` regresses LCP via bandwidth contention.
4. `04-fill-without-positioned-parent.md` — `fill` silently collapses to zero height without a sized, positioned parent.
5. `05-font-imported-per-component.md` — per-component font instantiation anti-pattern vs. centralized config.
6. `06-sizes-omitted-oversized-download.md` — missing `sizes` causes an oversized (but visually "correct") image download.

### scenarios/
1. `01-migrating-legacy-img-tags.md` — converting a raw-`<img>` landing page to `next/image` with correct `priority`/`sizes`.
2. `02-brand-refresh-two-fonts.md` — adding a local display font alongside an existing Google font via `next/font`.
3. `03-diagnosing-poor-lcp-score.md` — a step-by-step LCP triage for a product page.

### interview-qa/
1. `01-next-image-fundamentals.md` — required dimensions, `fill` usage, `sizes`, remote hostname configuration.
2. `02-priority-and-lcp.md` — what `priority` does mechanically, how many images should have it, priority vs. CLS.
3. `03-next-font-and-privacy.md` — performance/privacy rationale, combining font sources, `display: 'swap'` tradeoffs.

### problems/
1. `01-convert-img-to-next-image.md` — converting a raw `<img>` article cover to `next/image`, fixing a real layout-shift bug.
2. `02-setup-google-and-local-font.md` — centralized `next/font` config for a Google body font plus a local heading font.
3. `03-diagnose-and-fix-hero-lcp.md` — diagnosing a hero image hurting LCP due to misplaced `priority`.

### assets/
- `README.md` — placeholder pointing to the original notes source map.

No `projects/` folder for this topic per the assignment scope.
