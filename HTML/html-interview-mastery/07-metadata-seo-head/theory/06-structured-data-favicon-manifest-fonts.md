***  06-structured-data-favicon-manifest-fonts.md ***

# Structured Data (JSON-LD), Favicon/Manifest, and Font Preloading

Three smaller but commonly asked `<head>`/metadata topics, grouped together here since each is typically a light-touch, single-purpose addition rather than a deep topic on its own.

## Structured data via JSON-LD

Structured data is a standardized way to describe page content (a product, an article, a recipe, an FAQ) in a machine-readable format, enabling **rich results** in search — star ratings, price, availability, breadcrumbs, FAQ dropdowns shown directly in the SERP, not just a plain blue link.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Trail Runner Pro",
  "image": "https://example.com/images/trail-runner-pro.jpg",
  "description": "Lightweight trail running shoe with reinforced grip.",
  "sku": "TR-PRO-42",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "129.99",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "312"
  }
}
</script>
```

- **JSON-LD** (`type="application/ld+json"`) is the format Google explicitly recommends — a single self-contained `<script>` block, entirely separate from the visible page markup, which is a major advantage over the older microdata/RDFa approaches that required scattering `itemprop`/`itemscope` attributes throughout the visible HTML itself.
- The vocabulary comes from **schema.org**, a shared vocabulary maintained jointly by the major search engines, covering hundreds of content types (`Product`, `Article`, `Recipe`, `Event`, `FAQPage`, `BreadcrumbList`, `Organization`, and many more).
- Adding structured data does **not** guarantee a rich result will actually be shown — it makes the page *eligible*; search engines still apply their own quality/relevance judgment on top.
- Structured data must accurately reflect the actual visible page content — deliberately mismatched or manipulative structured data (e.g., fabricated ratings not shown anywhere on the page) violates search engine guidelines and can trigger a manual penalty.

## Favicon and web app manifest (light touch — PWA is covered elsewhere)

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

- `rel="icon"` sets the browser tab/bookmark icon; providing both a traditional `.ico` (broad legacy compatibility, including default fallback lookups some browsers still do for `/favicon.ico` at the root) and a modern `.svg` (crisp at any size, including dark-mode-aware variants via CSS `prefers-color-scheme` inside the SVG itself) covers the most ground.
- `rel="apple-touch-icon"` is the icon used specifically when a user adds the page to their iOS home screen.
- `rel="manifest"` links to a `site.webmanifest` (or `manifest.json`) file — a small JSON document declaring the app's name, icons at various sizes, theme color, and display mode (e.g., `standalone`), which is the minimum needed for "Add to Home Screen"/installability. Full PWA behavior (service workers, offline caching, push notifications) is a separate, larger topic — this is just the metadata surface of it.

## Preloading fonts (brief cross-reference)

```html
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin>
```

Covered in depth in the performance/loading-attributes topic, but worth noting here as part of a complete `<head>`: preloading a critical font referenced from CSS lets the browser start fetching it immediately rather than only discovering it after the stylesheet containing the `@font-face` rule has been fetched and parsed — directly shortening how long text renders in a fallback font before the intended one swaps in.
