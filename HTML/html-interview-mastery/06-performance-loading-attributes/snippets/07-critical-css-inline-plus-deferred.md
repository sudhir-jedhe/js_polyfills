***  07-critical-css-inline-plus-deferred.md ***

# Snippet: Inlined Critical CSS + Deferred Non-Critical CSS

```html
<head>
  <!-- Critical CSS inlined directly: zero extra network round trip, styles above-the-fold
       content the instant the browser has parsed this far -->
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    header { padding: 1rem; background: #111; color: #fff; }
  </style>

  <!-- Non-critical CSS: loaded without blocking render, using the media-swap trick -->
  <link rel="stylesheet" href="/styles/full.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/styles/full.css"></noscript>
</head>
```

`media="print"` makes the browser fetch `full.css` without treating it as render-blocking for the current (screen) view — it still downloads in the background. Once loaded, the inline `onload` handler flips `media` to `'all'`, applying the full stylesheet retroactively. The `<noscript>` fallback ensures the stylesheet still loads normally for users with JavaScript disabled.
