# Scenario: Migrating a Legacy Marketing Page Off Raw `<img>` Tags

A marketing page was built before the team standardized on `next/image` and
still uses raw `<img>` tags throughout. A Lighthouse audit flags both poor
CLS (images visibly cause content to jump as they load) and a subpar LCP
score (the hero image loads slowly and isn't prioritized). You need to
migrate the page without a visual regression.

**Approach:**

```jsx
// Before
export default function LandingPage() {
  return (
    <>
      <img src="/hero.jpg" alt="Product hero" className="w-full h-auto" />
      <div className="grid grid-cols-3 gap-4">
        <img src="/feature-1.jpg" alt="Feature 1" />
        <img src="/feature-2.jpg" alt="Feature 2" />
        <img src="/feature-3.jpg" alt="Feature 3" />
      </div>
    </>
  );
}
```

```jsx
// After
import Image from 'next/image';

export default function LandingPage() {
  return (
    <>
      <div className="relative w-full aspect-[16/9]">
        <Image
          src="/hero.jpg"
          alt="Product hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['feature-1', 'feature-2', 'feature-3'].map((slug) => (
          <div key={slug} className="relative aspect-square">
            <Image
              src={`/${slug}.jpg`}
              alt={slug.replace('-', ' ')}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
```

Points worth raising:

1. **Determine the LCP element first**, before touching any code — for a
   typical landing page, it's almost certainly the hero image, so `priority`
   goes there and only there.
2. **`fill` + a sized/positioned wrapper `div`** replaces the old
   `w-full h-auto` pattern, since raw `<img>` could rely on natural aspect
   ratio + `h-auto` in a way `next/image`'s required-dimensions model
   doesn't directly support without either explicit `width`/`height` or
   `fill`.
3. **`sizes="100vw"`** on the hero acknowledges it genuinely spans the full
   viewport width at every breakpoint — a case where treating it as
   full-width is *correct*, unlike the smaller grid images.
4. **Below-the-fold feature images stay unprioritized** (no `priority`),
   preserving the lazy-loading benefit that was never a problem for these —
   the original CLS/LCP issues were about the hero and about missing
   dimensions generally, not about every image needing eager loading.
5. **Remote image hostname configuration**: if any of these were actually
   remote CDN URLs rather than local `/public` assets, `next.config.js`'s
   `images.remotePatterns` would need updating too — worth checking before
   assuming the migration is purely a component-level change.
