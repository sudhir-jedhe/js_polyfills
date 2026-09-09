***  01-rewrite-head-for-performance.md ***

# Problem: Rewrite a `<head>` for Performance

## Problem Statement

Given the following unoptimized `<head>`, rewrite it applying every relevant technique from this topic: script loading attributes, resource hints, and render-blocking CSS mitigation. Explain each change.

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">
  <link rel="stylesheet" href="/styles/app.css">
  <script src="/vendor/jquery.js"></script>
  <script src="/vendor/chart-library.js"></script>
  <script src="/app.js"></script>
  <script src="https://widget.livechat.example.com/loader.js"></script>
</head>
```

Context: `app.js` depends on both `jquery.js` and `chart-library.js` having already run. The live-chat widget script is fully independent of the rest of the page. `app.css` is the site's own stylesheet and is required for correct above-the-fold layout. The Google Fonts stylesheet references font files hosted on a different domain (`fonts.gstatic.com`).

## Constraints

- Preserve the existing execution-order dependency: `jquery.js` → `chart-library.js` → `app.js`.
- The live-chat widget must not block or delay anything else on the page.
- Reduce the render-blocking cost of loading the Google Font.
- Do not change what any of the resources actually do — only how/when they load.

## Solution

```html
<head>
  <!-- Preconnect to the font CDN before its stylesheet is even parsed, since we know
       we'll need it -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">

  <!-- Site's own critical CSS: kept as a normal blocking <link> — it's genuinely
       needed for correct above-the-fold layout, so blocking render on it is
       appropriate (unlike the font, which can visually swap in later) -->
  <link rel="stylesheet" href="/styles/app.css">

  <!-- Font stylesheet: still render-blocking by default, but the preconnect above
       has already removed a full round trip from its critical path -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">

  <!-- Own scripts with a real ordering dependency: defer, in dependency order.
       Guaranteed to execute in this exact order, after parsing completes, before
       DOMContentLoaded — jquery.js is guaranteed to run before app.js needs it. -->
  <script src="/vendor/jquery.js" defer></script>
  <script src="/vendor/chart-library.js" defer></script>
  <script src="/app.js" defer></script>

  <!-- Fully independent third-party widget: async — loads and initializes on its
       own schedule, with zero impact on parsing or on the scripts above -->
  <script src="https://widget.livechat.example.com/loader.js" async></script>
</head>
```

**Why `jquery.js`/`chart-library.js`/`app.js` use `defer`, not `async`:** They have a strict dependency chain (`app.js` needs both of the others to have already run). `defer` guarantees document-order execution regardless of each file's individual download speed; `async` would let whichever file happens to download fastest run first, which could easily break `app.js` if it finished before its dependencies, exactly as illustrated in this topic's `scenarios/02` file.

**Why `&display=swap` was added to the Google Fonts URL:** It's the URL-parameter equivalent of `font-display: swap` in a manually written `@font-face` rule — it tells the browser to show fallback text immediately rather than blocking text rendering while the font itself is still loading, addressing the FOIT problem without needing to self-host the font.

**Why the widget script alone gets `async` instead of `defer`:** It has no dependency on `app.js`, `jquery.js`, or the DOM structure the page builds — there's no ordering requirement to preserve, so there's no reason to hold it back until parsing finishes; letting it load and run purely on its own schedule is strictly better.
