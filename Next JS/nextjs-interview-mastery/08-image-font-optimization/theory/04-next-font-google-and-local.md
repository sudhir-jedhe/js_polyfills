# `next/font`: Self-Hosting Fonts at Build Time

Loading fonts the traditional way — a `<link>` tag to `fonts.googleapis.com`,
or a `@import` in CSS — has two real costs that are easy to overlook.
**Performance**: the browser has to make a separate, render-blocking (or at
minimum, layout-affecting) network request to an external origin before text
using that font can paint correctly, and that request incurs its own DNS
lookup/connection setup on top of your own server's. **Privacy**: requesting
fonts directly from Google's CDN sends the visitor's IP address to Google on
every page load, which is a real compliance consideration for GDPR-conscious
teams in the EU and has led some organizations to explicitly ban directly
loading Google Fonts.

`next/font` solves both by **downloading the font files at build time** and
serving them from your own domain as static assets — no runtime request to
any external font provider at all, for either Google Fonts or custom local
fonts.

**Google Fonts**, imported directly by name:

```jsx
// app/layout.jsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

At build time, Next.js fetches the actual font files for `Inter` (using only
the specified `subsets`, keeping file size down) and self-hosts them under
`_next/static`. The `inter.className` applies the font-family CSS; the
`variable` option additionally exposes it as a CSS custom property
(`--font-inter`), useful for referencing the font from Tailwind config or
other CSS without hardcoding a class everywhere.

**Local/custom fonts** (a brand's proprietary typeface, not on Google Fonts)
use `next/font/local` instead, pointing at font files you've placed in your
project:

```jsx
// app/layout.jsx
import localFont from 'next/font/local';

const brandFont = localFont({
  src: [
    { path: '../fonts/Brand-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Brand-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-brand',
  display: 'swap',
});
```

Both APIs return an object with `.className` and (if `variable` is set)
`.variable` — apply `.className` to whatever scope should use that font
(commonly `<body>` or `<html>` for a site-wide font, or a specific wrapper
for a secondary font used only in part of the page).

**Using a Google font and a local font together** in the same layout is
completely normal — a common pattern is a primary body font from Google
Fonts plus a distinctive local display/heading font:

```jsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const brandDisplay = localFont({
  src: '../fonts/BrandDisplay.woff2',
  variable: '--font-display',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${brandDisplay.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

CSS then references `var(--font-display)` for headings and defaults to the
body font (`inter.className` on `<body>`) everywhere else — both fonts are
self-hosted, both avoid any external request, and both get the layout-shift
protections covered next.
