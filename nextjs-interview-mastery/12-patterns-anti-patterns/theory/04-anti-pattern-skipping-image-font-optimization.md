# Anti-Pattern: Not Using `next/image` / `next/font`

Full coverage of these APIs is in topic 08; this is the anti-pattern-focused version, specifically about what silently degrades when a team reaches for the raw HTML/CSS equivalents instead — usually because it's marginally less code to write in the moment, or out of habit from non-Next.js projects.

## Before: raw `<img>` and a Google Fonts `<link>` tag

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// components/hero.tsx
export function Hero({ imageUrl }: { imageUrl: string }) {
  return <img src={imageUrl} alt="Hero banner" />;
}
```

The costs here are concrete, not stylistic: the raw `<img>` serves whatever original file size/format exists at `imageUrl` — no automatic resizing to the actual rendered dimensions, no modern format conversion (WebP/AVIF) for browsers that support it, no lazy-loading below the fold by default, and no reserved space (since no `width`/`height` is set), so the image causes a layout shift when it loads. The Google Fonts `<link>` tag makes the browser do an additional round trip to `fonts.googleapis.com` (DNS lookup, connection, download) that blocks text rendering until the font resolves, and swaps the font in after an initial fallback-font render — both a render-blocking penalty and a font-swap layout shift.

## After: `next/image` and `next/font`

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// components/hero.tsx
import Image from 'next/image';

export function Hero({ imageUrl }: { imageUrl: string }) {
  return <Image src={imageUrl} alt="Hero banner" width={1200} height={480} priority />;
}
```

`next/font` downloads and self-hosts the font file at build time — no runtime request to a third-party font host, no render-blocking external round trip, and it computes fallback font metrics to minimize the visual shift when the real font swaps in. `next/image` automatically serves appropriately-sized, modern-format images, lazy-loads anything not marked `priority`, and reserves layout space via the required `width`/`height` (or a sized `fill` container), directly preventing the image-triggered layout shift the raw `<img>` version was prone to.

## Why this keeps happening despite being "well known"

The raw HTML equivalents *work* — they render something correct-looking in a quick local check, and the actual damage (CLS, slower LCP, wasted bandwidth on oversized images) only shows up in real performance measurement (Lighthouse, field data), not in a cursory glance at the rendered page. This is exactly why it's worth treating "does this use `next/image`/`next/font`" as a standing code-review checklist item rather than something caught only during a dedicated performance audit — by the time a project has scattered raw `<img>` tags across dozens of components, the fix becomes a larger cleanup task instead of a one-line habit enforced at review time.
