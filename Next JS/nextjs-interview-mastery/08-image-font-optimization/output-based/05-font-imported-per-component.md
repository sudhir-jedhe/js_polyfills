## What's inefficient about this font setup?

```jsx
// components/Hero.jsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export function Hero() {
  return <h1 className={inter.className}>Welcome</h1>;
}

// components/Footer.jsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export function Footer() {
  return <footer className={inter.className}>© 2026</footer>;
}
```

Both components use the same font, imported and instantiated separately in
each file.

**Answer:** This isn't a functional bug — `next/font` still deduplicates
the underlying font file at build time, so it doesn't literally double-ship
the font bytes — but it's a maintainability and consistency anti-pattern
that commonly leads to real bugs later: if someone updates the `subsets` or
`weight` config in one file and forgets the other, the two components can
drift out of sync (e.g., one loads `latin` + `latin-ext`, the other doesn't),
producing subtly inconsistent font rendering or unnecessarily large font
subsets loaded twice with different configs.

**Why:** The idiomatic pattern is to instantiate a font **once**, in a
shared module, and import the resulting object everywhere it's needed —
mirroring how you'd centralize any other shared design-system primitive
(a color palette, a spacing scale):

```js
// lib/fonts.js
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

```jsx
// components/Hero.jsx
import { inter } from '@/lib/fonts';
export function Hero() {
  return <h1 className={inter.className}>Welcome</h1>;
}
```

```jsx
// components/Footer.jsx
import { inter } from '@/lib/fonts';
export function Footer() {
  return <footer className={inter.className}>© 2026</footer>;
}
```

This also makes it trivial to apply the font's CSS variable once at the root
layout (`className={inter.variable}` on `<html>`) and reference `var(--font-inter)`
from CSS anywhere, rather than needing to import and apply `inter.className`
in every single component that uses text.
