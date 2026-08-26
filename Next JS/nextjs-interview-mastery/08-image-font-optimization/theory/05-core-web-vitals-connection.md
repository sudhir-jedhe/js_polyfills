# How Image and Font Optimization Move Core Web Vitals

Core Web Vitals aren't an abstract quality score — they're specific,
measurable moments in a page's load timeline, and `next/image` and
`next/font` each target a specific one directly.

**LCP (Largest Contentful Paint)** measures when the largest visible element
finishes rendering — usually a hero image or a large block of text. Two
mechanisms improve it here: `priority` on the actual LCP image adds a
preload hint and disables lazy loading, so the browser starts fetching that
image as early as physically possible in the load sequence rather than
waiting for viewport-intersection logic to kick in. Separately, if the LCP
element is *text* rather than an image, font loading strategy matters just
as much — a render-blocking external font request (the traditional
`<link>`-to-Google-Fonts pattern) delays when that text can paint at all,
while `next/font`'s self-hosted, build-time-fetched fonts remove that
external round trip entirely, letting text paint sooner.

**CLS (Cumulative Layout Shift)** measures how much visible content
unexpectedly moves during load. `next/image`'s mandatory `width`/`height` (or
`fill` inside a sized container) reserves the image's aspect ratio in the DOM
before the bytes arrive, so nothing shifts when the image pops in — this is
structural, not optional, since the props are required. Fonts contribute to
CLS too, in a way people often miss: if a custom font loads *after* a
fallback system font has already rendered text, and the two fonts have
different metrics (character width, line height), the text reflows once the
custom font swaps in — a phenomenon informally called "flash of unstyled
text" (FOUT) when it causes visible shift. `next/font` mitigates this
automatically by using **size-adjust font descriptors** it calculates at
build time, matching the fallback font's metrics as closely as possible to
the actual custom font, which significantly reduces the visual jump when the
real font swaps in — something you'd have to hand-tune manually (or simply
not know to do) with a traditional external font-loading setup.

**`display: 'swap'`** (the option shown throughout the `next/font` examples)
is itself a CLS/rendering tradeoff worth understanding: it tells the browser
to render text using a fallback font immediately, then swap to the real font
once it's loaded, rather than showing invisible text while waiting
(`display: 'block'`/the default "flash of invisible text" behavior). `swap`
generally wins for perceived performance (text is readable immediately) at
the cost of a font swap moment — which `next/font`'s automatic fallback
metric matching specifically softens.

Putting it together, a realistic before/after an interviewer might want you
to narrate: a page with a raw `<img>` hero (no dimensions) and a
`<link>`-loaded Google Font shows layout shift as the image pops in and
again as the font swaps in, plus a slow LCP because both the image and the
font block on external/late-starting requests. Swapping to `next/image`
with `priority` + correct dimensions, and `next/font` for the typeface,
addresses both metrics simultaneously — not as two unrelated optimizations,
but as the same underlying principle applied to two different resource
types: **reserve space ahead of time, and start loading critical resources
as early as possible, from your own origin.**
