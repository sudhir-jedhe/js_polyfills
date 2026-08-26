# Scenario: Brand Refresh Adds a Custom Display Font

Design ships a brand refresh: body copy stays on a Google Font (Inter) for
readability, but all headings should use a new proprietary display typeface
that only exists as licensed `.woff2` files (not available on Google Fonts).
The team is currently loading Inter via a `<link>` tag to
`fonts.googleapis.com` in the root `<head>`, and the new display font would
naively be added the same way via a third-party `@font-face` CDN link if
this weren't fixed properly.

**Approach:**

Move both onto `next/font` — Inter via `next/font/google`, the display font
via `next/font/local` — eliminating both external font requests entirely.

```
fonts/
  BrandDisplay-Regular.woff2
  BrandDisplay-Bold.woff2
```

```js
// lib/fonts.js
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const brandDisplay = localFont({
  src: [
    { path: '../fonts/BrandDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/BrandDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});
```

```jsx
// app/layout.jsx
import { inter, brandDisplay } from '@/lib/fonts';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${brandDisplay.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

```css
/* globals.css */
h1, h2, h3, h4 {
  font-family: var(--font-display);
}
```

Points worth raising:

1. **Both fonts move to build-time self-hosting** — removing the
   `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` entirely
   eliminates a render-blocking external request and the associated privacy
   concern of the visitor's IP being sent to Google on every page load.
2. **CSS variables, not just `.className`**, are the right integration point
   here specifically because two different fonts need to apply to different
   parts of the page (body vs. headings) — `variable` exposes both as custom
   properties usable from any stylesheet, rather than needing to thread
   `.className` through every heading component individually.
3. **Centralized `lib/fonts.js`** avoids the "instantiated separately per
   component, configs drift out of sync" anti-pattern — both fonts are
   configured once and imported everywhere needed.
4. **`display: 'swap'` on both** keeps text visible immediately using
   fallback fonts while the real fonts load, and `next/font`'s automatic
   fallback-metric matching minimizes the visual jump when each font swaps
   in — worth mentioning as the CLS-mitigation detail that's easy to
   otherwise overlook when just focused on "get the new font working."
