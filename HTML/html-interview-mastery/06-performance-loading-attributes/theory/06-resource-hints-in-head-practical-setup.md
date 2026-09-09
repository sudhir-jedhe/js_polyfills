***  06-resource-hints-in-head-practical-setup.md ***

# Putting It Together: A Well-Optimized `<head>`

Interviewers sometimes ask you to look at (or write) a realistic `<head>` and identify what's slowing it down, or to build one from scratch applying everything covered in this topic. This file walks through a complete, annotated example.

## A poorly optimized `<head>`

```html
<head>
  <script src="analytics.js"></script>
  <link rel="stylesheet" href="fonts.css">
  <script src="jquery.js"></script>
  <script src="app.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>
```

Problems:
1. Three render-blocking `<script>` tags in a row, each pausing HTML parsing until fetched *and* executed, one after another — the DOM can't even finish building until all three have run.
2. `app.js` almost certainly depends on `jquery.js` having already executed, which happens to work here only because of strict document-order blocking — fragile, and it's blocking the whole page to guarantee that ordering.
3. `analytics.js` is a third-party script with no relationship to the page's own rendering, yet it's blocking parsing just like the critical scripts.
4. The font stylesheet isn't preconnected/preloaded, so the actual font file (referenced inside `fonts.css`, discovered only after that CSS is fetched and parsed) starts downloading late — a common cause of a visible flash of invisible/fallback text (FOIT/FOUT).

## The optimized version

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Critical CSS first — render-blocking, but small and necessary -->
  <link rel="stylesheet" href="styles.css">

  <!-- Preconnect to the font CDN before its stylesheet is even parsed -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="fonts.css">

  <!-- Preload the actual font file the CSS will reference — the browser wouldn't
       otherwise discover it until fonts.css is parsed -->
  <link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Own app scripts: defer, in dependency order — full DOM guaranteed, executes in order -->
  <script src="jquery.js" defer></script>
  <script src="app.js" defer></script>

  <!-- Independent third-party script with no page dependency: async -->
  <script src="analytics.js" async></script>
</head>
```

Why each change helps:
- `jquery.js`/`app.js` switched to `defer`: HTML parsing is no longer paused for them, they still execute in guaranteed document order (so `app.js` can safely assume `jquery.js` has already run), and both are guaranteed to finish before `DOMContentLoaded`.
- `analytics.js` switched to `async`: it has no dependency on the DOM or other scripts, so there's no reason to force any particular execution order relative to parsing — it runs the moment it's ready, without blocking anything else.
- `preconnect` to the font CDN removes a DNS+TCP+TLS round trip from the critical path of loading the font stylesheet.
- `preload` on the actual `.woff2` file lets the browser start fetching the font in parallel with `fonts.css`, rather than waiting to discover it only after `fonts.css` is fetched and parsed — directly reducing the window where fallback/invisible text is shown.

## A note on ordering `<link rel="preload">` vs. the real stylesheet

The `preload` for the font is placed **after** the `fonts.css` link in the example above purely for readability grouping; in practice, since `preload` is fetched by the preload scanner regardless of position in `<head>` (as long as it's discovered before the main parser needs it), exact ordering among independent resource hints matters far less than ensuring the hints exist at all and target the right resources.
