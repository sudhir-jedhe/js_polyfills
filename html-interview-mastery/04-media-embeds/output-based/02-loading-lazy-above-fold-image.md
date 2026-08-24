# Output: `loading="lazy"` on the Hero Image

```html
<body>
  <header>
    <img src="hero-banner.jpg" alt="New collection launch" loading="lazy" width="1600" height="600">
  </header>
  <main>...</main>
</body>
```

**Question:** This image is the very first thing visible in the viewport on page load (no scrolling required). What effect does `loading="lazy"` have here, and is this a good or bad choice?

**Answer:** This is a **bad choice**, and often measurably harmful. `loading="lazy"` doesn't just "not help" here — it can actively **delay** the image's load start compared to the default `eager` behavior, because browsers implementing lazy-loading typically wait for layout/style calculation to determine whether the image is near the viewport before beginning the fetch, adding latency to what should be the earliest possible request for this specific image.

**Why:** `loading="lazy"` exists specifically to defer *offscreen* images — content the user may scroll to eventually, or never. Applying it to the hero image (very likely the page's Largest Contentful Paint element) works directly against the goal `loading="lazy"` is meant to serve elsewhere on the same page: this image should instead have no `loading` attribute (default `eager`) and ideally `fetchpriority="high"` to actively prioritize it, since it's probably the single most important resource for perceived load speed on this page.
