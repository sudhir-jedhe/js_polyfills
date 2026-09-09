***  02-missing-viewport-meta-mobile-rendering.md ***

# Output: Mobile Rendering Without a Viewport Meta Tag

```html
<head>
  <meta charset="UTF-8">
  <title>Responsive Site</title>
  <style>
    @media (max-width: 600px) {
      body { font-size: 20px; background: yellow; }
    }
  </style>
</head>
```

No `<meta name="viewport">` tag is present. The site is opened on a phone with a 390px-wide screen.

**Question:** Does the `@media (max-width: 600px)` rule apply? Does the page look "responsive"?

**Answer:** The media query technically CAN apply, but the page still looks broken/zoomed-out and non-responsive in practice — tiny, unreadable text, requiring the user to pinch-zoom in.

**Why:** Without a viewport meta tag, mobile browsers render the page inside a **virtual viewport** set to a desktop-like width (historically around 980px) and then scale the entire rendered result down to fit the physical 390px screen. Critically, the media query evaluates against that *virtual* viewport width, not the physical screen width — so `max-width: 600px` may not even match (980px > 600px), and even if some other query did match, the overall page is still shrunk to fit, making everything look tiny regardless. Adding `<meta name="viewport" content="width=device-width, initial-scale=1">` sets the virtual viewport to actually equal the device's real width, which is the missing piece that makes `max-width: 600px` correctly match a 390px-wide phone and renders the page at a legible, unscaled size.
