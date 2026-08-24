# Which `srcset` Candidate Does the Browser Choose?

```html
<img
  srcset="
    photo-480w.jpg 480w,
    photo-960w.jpg 960w,
    photo-1440w.jpg 1440w
  "
  sizes="(min-width: 768px) 50vw, 100vw"
  alt="Product photo"
/>
```

**Question:** On a device with a viewport width of `1000px` and a device pixel ratio (DPR) of `2` (a typical "Retina"-class display), which `srcset` candidate does the browser download?

**Answer:** `photo-1440w.jpg` (the largest of the three).

**Why:** First, `sizes` is evaluated against the viewport: `min-width: 768px` matches (`1000 >= 768`), so the image will render at `50vw` — 50% of a `1000px` viewport, i.e. `500px` of actual CSS/rendered width. Then the browser factors in device pixel ratio: to render sharply on a `2x` DPR screen, it needs an image with at least `500px * 2 = 1000px` of real pixel width. Among the three `srcset` candidates (`480w`, `960w`, `1440w`), the smallest one that still meets or exceeds `1000px` is `1440w` (`960w` falls short at only `960px`, which is less than the required `1000px`). So the browser picks `photo-1440w.jpg` — not necessarily the largest possible file in every case, but here it happens to be, because `960w` narrowly fails to meet the `2x`-adjusted requirement. If the DPR had been `1x` instead, the required real pixel width would only be `500px`, and the browser would pick `photo-960w.jpg` instead — the smallest candidate that still clears `500px`.
