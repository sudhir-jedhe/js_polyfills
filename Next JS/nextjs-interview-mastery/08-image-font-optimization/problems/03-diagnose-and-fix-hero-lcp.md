# Problem 3: Diagnose and Fix a Hero Image Hurting LCP

## Task

You're handed this homepage, with a Lighthouse report showing:

- LCP: 3.8s (poor)
- LCP element: the hero `<Image>`
- CLS: 0.02 (fine)

```jsx
// app/page.jsx — BROKEN
import Image from 'next/image';

export default function HomePage() {
  return (
    <main>
      <div className="relative w-full h-[500px]">
        <Image
          src="/hero.jpg"
          alt="Welcome to Acme"
          fill
          className="object-cover"
        />
      </div>
      <section className="grid grid-cols-3 gap-4 mt-8">
        <Image src="/f1.jpg" alt="Feature 1" width={400} height={300} priority />
        <Image src="/f2.jpg" alt="Feature 2" width={400} height={300} priority />
        <Image src="/f3.jpg" alt="Feature 3" width={400} height={300} priority />
      </section>
    </main>
  );
}
```

Diagnose what's wrong and fix it. There are two separate issues.

## Constraints

- CLS is already fine — don't change the dimension-reservation approach for
  the hero, only what's actually causing the LCP problem.
- The three feature images are below the fold.

## Solution

**Issue 1 — the actual LCP element (hero) is missing `priority`.** It's
using `fill` with correct dimensions (via the sized, positioned wrapper,
which is why CLS is fine), but with no `priority` prop it's still subject to
default lazy loading, so its fetch doesn't start as early as it could.

**Issue 2 — the three below-the-fold feature images are incorrectly marked
`priority`**, which is backwards: they compete for eager, high-priority
bandwidth with the actual hero image, working against it rather than
helping, on top of losing their lazy-loading benefit for content the user
may not scroll to immediately.

```jsx
// app/page.jsx — FIXED
import Image from 'next/image';

export default function HomePage() {
  return (
    <main>
      <div className="relative w-full h-[500px]">
        <Image
          src="/hero.jpg"
          alt="Welcome to Acme"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <section className="grid grid-cols-3 gap-4 mt-8">
        <Image src="/f1.jpg" alt="Feature 1" width={400} height={300} />
        <Image src="/f2.jpg" alt="Feature 2" width={400} height={300} />
        <Image src="/f3.jpg" alt="Feature 3" width={400} height={300} />
      </section>
    </main>
  );
}
```

The fix moves `priority` to where it actually helps (the hero, the real LCP
candidate) and removes it from where it was actively hurting (three
below-the-fold images unnecessarily competing for eager bandwidth). Also
added `sizes="100vw"` on the hero since it's a `fill` image spanning the
full viewport width — without it, the responsive `srcset` selection would
under-inform the browser's size choice even with `priority` correctly set.
