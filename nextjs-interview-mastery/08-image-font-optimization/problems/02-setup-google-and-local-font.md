# Problem 2: Set Up `next/font` for a Google Font and a Local Font

## Task

Configure the root layout of an app to use:

- **Roboto** (Google Font) as the default body font, subset to `latin`, with
  `display: 'swap'`.
- A local custom font called **"Editorial"** (files already placed at
  `fonts/Editorial-Regular.woff2` and `fonts/Editorial-Bold.woff2`) for all
  headings (`h1`–`h4`) only.
- Both exposed as CSS custom properties so they can be referenced from
  `globals.css` without importing the font objects into every component
  that uses headings.
- Centralize the font configuration in one module, not inline in the layout
  file, so other files can import the same font objects if ever needed.

## Constraints

- No component other than the root layout should need to import
  `next/font/google` or `next/font/local` directly.
- Headings styled purely via CSS, not by wrapping every heading in a
  component that applies `.className`.

## Solution

```js
// lib/fonts.js
import { Roboto } from 'next/font/google';
import localFont from 'next/font/local';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const editorial = localFont({
  src: [
    { path: '../fonts/Editorial-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Editorial-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
});
```

```jsx
// app/layout.jsx
import { roboto, editorial } from '@/lib/fonts';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${editorial.variable}`}>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
```

```css
/* globals.css */
h1, h2, h3, h4 {
  font-family: var(--font-heading);
}
```

This satisfies every constraint: the font objects are instantiated exactly
once in `lib/fonts.js`; the root layout applies `roboto.className` as the
document-wide default and both fonts' `variable` values as CSS custom
properties on `<html>`; `globals.css` targets headings purely by selector,
with no per-component `.className` wiring required anywhere else in the app.
