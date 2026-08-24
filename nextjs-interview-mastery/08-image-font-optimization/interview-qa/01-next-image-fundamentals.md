# Interview Q&A: `next/image` Fundamentals

**Q: Why are `width` and `height` required on `next/image`, when a plain `<img>` works fine without them?**
A: Next.js uses them to compute the image's aspect ratio and reserve that space in the DOM before the actual image bytes have downloaded, which is exactly what prevents Cumulative Layout Shift — content jumping around as an unsized image pops in. Making them mandatory (rather than "recommended") means this class of bug is structurally prevented rather than dependent on developer discipline.

**Q: When would you use `fill` instead of `width`/`height`?**
A: When the image needs to stretch to match a container whose size is responsive/dynamic rather than a known fixed value — a hero banner, a card image in a fluid grid. The parent element must establish a positioning context (`position: relative`) and have its own defined size (fixed height or `aspect-ratio`), since `fill` positions the image absolutely relative to that parent rather than carrying its own intrinsic dimensions.

**Q: What does the `sizes` prop actually do, and when does omitting it matter?**
A: It tells the browser what width the image will actually render at across different breakpoints, so the browser's responsive `srcset` selection picks an appropriately-sized image variant instead of guessing. It mainly matters for `fill` images (or otherwise responsive layouts) that render meaningfully smaller than full-viewport-width — omitting it there causes Next.js to fall back toward a larger default assumption, so the browser downloads a bigger image than necessary, with no visible symptom beyond a slower load and a worse Lighthouse score.

**Q: Why would an image from a CMS or CDN fail to load through `next/image` even though the URL works fine in a browser tab?**
A: `next/image` refuses to optimize remote images from hostnames that aren't explicitly allow-listed in `next.config.js`'s `images.remotePatterns`, as a security measure against your server being used as an arbitrary open image proxy. This is a very common "works with local test images, breaks against the real CMS" bug — the fix is adding the CMS/CDN's hostname to `remotePatterns`.
