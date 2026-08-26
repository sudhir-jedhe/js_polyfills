# `next/image`: What It Automates and Why

`next/image`'s `Image` component isn't a styled wrapper around `<img>` for
convenience — it fundamentally changes how images are delivered. Behind the
scenes, Next.js runs requests for optimized images through an image
optimization pipeline (either built into the Next.js server, or delegated to
a provider like Vercel's/Cloudflare's image CDN in production), which does
three things a raw `<img>` never does automatically: **responsive resizing**
(serving a size appropriate to the actual rendered dimensions and the
device's viewport/DPR, not the original full-resolution file), **modern
format conversion** (serving WebP or AVIF to browsers that support them,
falling back to the original format otherwise), and **lazy loading by
default** (images outside the viewport don't load until the user scrolls
near them, unless you opt out).

```jsx
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={300}
    />
  );
}
```

**`width` and `height` are required** (unless using `fill`, covered below) —
and this is not an arbitrary API decision. Next.js uses these values to
compute and reserve the image's aspect ratio in the DOM *before* the actual
image bytes have downloaded, which is exactly what prevents **Cumulative
Layout Shift (CLS)**: the classic bug where text and other content jump
around as images pop in and push everything below them downward. A raw
`<img>` with no `width`/`height` attributes has no reserved space until it
loads, so the browser has to reflow the page the moment the image arrives —
`next/image` structurally prevents this class of bug by making the
dimensions mandatory input, not an optional best practice you might forget.

For images whose container size is dynamic/responsive rather than a fixed
pixel value (a hero banner that spans the full width of an unpredictable
parent), use `fill` instead of explicit `width`/`height`:

```jsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/hero.jpg"
    alt="Product hero shot"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>
```

`fill` makes the image absolutely positioned to cover its nearest positioned
ancestor — which is why the parent needs `position: relative` (or another
positioning context) and an explicit size of its own; the image still needs
*some* reserved dimensions to prevent layout shift, they've just moved to the
container instead of the `<img>` itself.

**Lazy loading by default** means every `<Image>` not marked `priority` waits
to load until it's near the viewport — good for pages with many images below
the fold (a product grid, a long article), since it avoids downloading
images the user may never scroll to. But this default is exactly wrong for
above-the-fold, immediately-visible images — that's what the `priority` prop
overrides, and it's covered in depth in the theory file on Core Web Vitals,
because getting this one prop wrong is a frequent, measurable LCP regression.
