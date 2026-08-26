*** copy 03-preconnect-and-preload-fonts.md ***

# Snippet: `preconnect` + `preload` for Web Fonts

```html
<head>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

  <style>
    @font-face {
      font-family: 'Inter';
      src: url('/assets/fonts/inter-var.woff2') format('woff2');
      font-display: swap; /* show fallback text immediately, swap in once the font loads */
    }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
```

`preload` starts fetching the actual font file immediately, in parallel with everything else, instead of waiting for the browser to parse the `@font-face` rule inside `<style>` and only then discover it needs that file. `font-display: swap` means text renders with a fallback font right away rather than staying invisible (FOIT) while the preloaded font is still in flight.
