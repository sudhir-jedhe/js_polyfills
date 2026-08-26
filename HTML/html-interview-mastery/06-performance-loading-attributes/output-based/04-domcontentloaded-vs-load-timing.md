*** copy 04-domcontentloaded-vs-load-timing.md ***

# Output: `DOMContentLoaded` vs. `load` — Which Fires First, and When?

```html
<head>
  <script src="app.js" defer></script>
</head>
<body>
  <img src="huge-photo.jpg" alt="">
  <script>
    document.addEventListener('DOMContentLoaded', () => console.log('DOMContentLoaded'));
    window.addEventListener('load', () => console.log('load'));
  </script>
</body>
```

Assume `app.js` takes 100ms to fetch, and `huge-photo.jpg` takes 3 seconds to fully download.

**Question:** Which event logs first, and does `load` wait for the image?

**Answer:** `"DOMContentLoaded"` logs first (roughly around the 100ms mark, once `app.js` — a `defer` script — has finished executing and parsing is complete), and `"load"` logs afterward (around the 3-second mark), because `load` waits for **every** resource on the page, including images, to fully finish loading — not just the DOM/HTML/deferred scripts.

**Why:** `DOMContentLoaded` fires once the HTML has been fully parsed and all `defer` scripts have executed — it does **not** wait for images, stylesheets (beyond what's needed for parsing/CSSOM), or other subresources to finish downloading. `load` fires much later, only once absolutely everything referenced by the page — every image, every stylesheet, every iframe — has finished loading. This is why `DOMContentLoaded` is the right event for "the DOM is ready, safe to run app logic that queries elements," while `load` is reserved for logic that genuinely needs every resource present (e.g., measuring final rendered image dimensions).
