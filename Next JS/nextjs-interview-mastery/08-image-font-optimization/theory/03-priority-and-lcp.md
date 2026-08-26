# `priority` and Largest Contentful Paint

**Largest Contentful Paint (LCP)** measures how long it takes for the
largest visible content element — very often a hero image, a banner, or a
large above-the-fold photo — to fully render. It's one of Google's three
Core Web Vitals, directly influences search ranking, and is exactly the
metric `next/image`'s `priority` prop is designed to protect.

By default, every `<Image>` is lazy-loaded — it doesn't start downloading
until it's near the viewport, using the browser's native `loading="lazy"`
mechanism (plus Next's own optimization pipeline). This is the right default
for the *majority* of images on a typical page, most of which are below the
fold. But it's actively harmful for the one image that's usually the LCP
candidate: a large hero/banner image visible immediately on page load.
Lazy-loading it means the browser doesn't even start the download until its
own layout/intersection logic decides it's "near enough" — which, for an
image that's already in the initial viewport, adds unnecessary delay before
the download even begins.

```jsx
// app/page.jsx
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <Image
        src="/hero.jpg"
        alt="New summer collection"
        width={1600}
        height={900}
        priority // eagerly loaded, high fetch priority, not lazy
      />
      {/* below-the-fold images stay lazy by default — no priority needed */}
      <Image src="/feature-1.jpg" alt="Feature one" width={600} height={400} />
    </>
  );
}
```

`priority` does two things simultaneously: it disables lazy loading for that
specific image (equivalent to `loading="eager"`), and it adds a `<link
rel="preload">` hint for the image in the document `<head>`, telling the
browser to fetch it as early as possible in the page load sequence — even
before the browser's HTML parser would otherwise discover the `<img>` tag
deep in the body. This preload hint is often the larger of the two effects
in practice, since it can shave meaningful time off when the download
*starts*, not just whether it's eager vs. lazy.

**The common mistake in both directions**: marking every image `priority`
(defeats the purpose — if everything is high-priority, nothing is,
and you've just made every image compete for bandwidth/eagerly load,
regressing overall page load) or marking nothing `priority` on a page whose
actual LCP element is an image (leaving free performance on the table for
the one image that matters most to the metric). The correct pattern is
almost always **exactly one, at most a small handful, of `priority` images
per page** — specifically the one(s) that are the actual LCP candidate,
determined either by knowing the design (the hero is obviously it) or by
checking real Lighthouse/PageSpeed Insights output that names the LCP
element directly.

Pairing `priority` with correct `width`/`height` (or `fill` + `sizes`) is
what delivers the full LCP + CLS win together: the image starts loading as
early as technically possible (`priority`) into space that was already
reserved so nothing shifts around it while it loads (`width`/`height`).
