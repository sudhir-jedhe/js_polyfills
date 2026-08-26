*** copy 06-lazy-loading-above-fold-image.md ***

# Output: `loading="lazy"` on an Above-the-Fold Hero Image

```html
<body>
  <img src="hero.jpg" alt="Hero" loading="lazy" width="1200" height="500">
  <p>Welcome to our site.</p>
</body>
```

Assume `hero.jpg` is the very first thing visible when the page loads, with no scrolling required.

**Question:** Does `loading="lazy"` prevent this image from loading? Is this a good use of the attribute?

**Answer:** It doesn't prevent the image from ever loading — since the image is already within (or immediately at) the viewport on page load, the browser will still fetch it essentially right away. But it's **not** a good use of the attribute: `loading="lazy"` can still add a small amount of deferred priority/timing overhead compared to eager loading, and for content that's guaranteed to be visible immediately, that's a pure downside with no benefit — the entire point of lazy loading is to defer resources the user *might not* scroll to, which doesn't apply here.

**Why:** `loading="lazy"` is meant for content below the fold that a meaningful fraction of users may never scroll to see — deferring its fetch saves bandwidth and lets the browser prioritize what's actually visible first. For an image that's visible on load, the correct approach is to leave `loading` at its default (or explicitly `eager`), and for a genuinely critical hero image, consider adding `fetchpriority="high"` instead, to hint the browser to prioritize it *above* other competing resources, the opposite intent of `lazy`.
