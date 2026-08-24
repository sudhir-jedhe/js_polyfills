# Interview Q&A — Container Queries & Responsive Images

**Q: What's the fundamental difference between `@media` and `@container` queries?**
`@media` responds to the viewport's (or device's) characteristics. `@container` responds to the size of a specific ancestor element that's been explicitly opted in as a query container via `container-type`. This lets a component adapt to the actual space it's been given wherever it's placed, rather than to the page's overall viewport size, which may not correlate with the component's real available space.

**Q: How do you make an element a query container, and what are the `container-type` options?**
Set `container-type` on the ancestor: `inline-size` enables querying that element's width only (the common case, and doesn't force strict sizing on both axes); `size` enables querying both width and height, but requires the element to have layout/size containment on both axes, meaning its own size can no longer be driven by its children's content size; `normal` (the default) means the element is not a query container at all.

**Q: Why might `container-type: size` cause a container's content to collapse unexpectedly?**
Because `size` containment means the container can no longer size itself based on its children — it needs its size determined some other way (an explicit height, or being sized by its own parent's layout, like a grid/flex item), otherwise it may collapse to zero height since nothing is telling it how tall to be.

**Q: What's the difference between resolution switching and art direction in responsive images, and which HTML feature solves each?**
Resolution switching means serving the *same image content* at different file sizes/resolutions depending on viewport width and device pixel ratio — a pure performance optimization, solved with `<img srcset sizes>`. Art direction means serving genuinely *different image content or crops* depending on layout conditions (e.g. a wide landscape crop on desktop vs. a tighter portrait crop on mobile) — a design decision, solved with `<picture>` and per-condition `<source>` elements.

**Q: In `<img srcset="photo-400w.jpg 400w, photo-800w.jpg 800w" sizes="50vw">`, what do the `w` descriptor and the `sizes` attribute each represent, and how does the browser use them together?**
The `w` descriptor states each candidate file's actual intrinsic pixel width (not a CSS value). `sizes` states what CSS width the image will actually render at, given the current viewport (`50vw` here, meaning half the viewport width). The browser combines the rendered width from `sizes` with the device's pixel density to compute the minimum real pixel width needed for a sharp image, then picks the smallest `srcset` candidate that satisfies that requirement — the browser makes this choice; you cannot force a specific file via CSS or HTML attributes alone.
