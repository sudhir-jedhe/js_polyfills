# `width`/`height`, `fill`, and `sizes` in Practice

There are two distinct modes for `next/image`, and picking the wrong one for
a given layout is the most common real-world mistake with this component.

**Fixed-dimension mode** (`width` + `height`) is for images whose intrinsic
size you know and want to render at (or scale proportionally from) — an
avatar, a product thumbnail, an icon-sized graphic:

```jsx
<Image src="/avatar.jpg" alt="User avatar" width={48} height={48} />
```

Next.js uses `width`/`height` to compute the aspect ratio, renders the
`<img>` with that ratio reserved via CSS, and — critically — these numbers
don't have to match the image's *rendered* CSS size exactly; you can still
make it responsive with CSS (`className="w-full h-auto"`, or inline styles)
as long as the aspect ratio stays consistent, since Next uses `width`/`height`
primarily to compute and communicate the ratio, not to hardcode the physical
size.

**`fill` mode** is for images that need to stretch to fill an unpredictable
or fully responsive parent container — a hero banner, a background-style
image, a card image whose container size depends on a CSS grid:

```jsx
<div className="relative aspect-video w-full">
  <Image src="/banner.jpg" alt="Seasonal sale banner" fill className="object-cover" />
</div>
```

The parent must establish a positioning context (`position: relative` or
similar) and have its own defined size (fixed height, `aspect-ratio`, or
similar) — `fill` makes the `<Image>` absolutely position itself to match
that container, but doesn't create the space itself, which is why "using
`fill` but forgetting to size the parent" is a common bug that produces a
zero-height, invisible image.

**`sizes`** matters whenever an image's rendered width varies meaningfully
across breakpoints (a full-bleed hero on mobile that becomes a half-width
column on desktop) — it tells Next.js's responsive `srcset` generation which
image size to actually pick for a given viewport, rather than guessing based
on the CSS layout alone (which the browser can't know ahead of the actual
render/paint):

```jsx
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

Omitting `sizes` on a `fill` image that's *not* full-viewport-width is a
subtle performance bug: Next.js falls back to a default assumption (commonly
treating it as close to full-viewport-width for responsive `srcset`
purposes), which can cause the browser to download a much larger image than
what's actually rendered — the image looks correct, but the bytes
transferred are needlessly large, hurting load performance without any
visible symptom to casually notice.

Rule of thumb worth stating plainly in an interview: **fixed, known
dimensions → `width`/`height`. Responsive, container-driven dimensions →
`fill` plus a correctly configured `sizes` on any breakpoint-varying
layout.**
