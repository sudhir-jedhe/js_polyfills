# Snippet: Favicon and Web App Manifest Links

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#111827">
```

```json
// site.webmanifest
{
  "name": "Example Store",
  "short_name": "Example",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#111827",
  "background_color": "#ffffff"
}
```

`theme-color` tints the browser UI (address bar on mobile) to match branding. The manifest's `display: "standalone"` is what lets the site be added to a home screen and open without browser chrome, the minimal metadata surface of PWA installability.
