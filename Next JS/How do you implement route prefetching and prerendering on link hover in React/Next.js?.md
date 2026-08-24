Implementing route prefetching and prerendering on hover accelerates page transitions from hundreds of milliseconds to near-instantaneous (0–50ms).

---

### 1. In Next.js (App Router)

By default, Next.js `<Link>` automatically prefetches routes that enter the viewport in production. However, to implement **on-hover prefetching** programmatically (or to trigger full prerenders), you use `useRouter().prefetch`.

#### Custom Hover Prefetch Link Component

```tsx
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HoverPrefetchLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  delayMs?: number; // Avoid prefetching on fast mouse-over swipes
}

export function HoverPrefetchLink({
  href,
  children,
  delayMs = 100,
  ...props
}: HoverPrefetchLinkProps) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Debounce slightly (e.g. 100ms) to ensure intentional hover
    timerRef.current = setTimeout(() => {
      router.prefetch(href);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <Link
      href={href}
      prefetch={false} // Disable auto viewport prefetch if you want hover-only
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => router.prefetch(href)} // Accessibility: support keyboard navigation
      {...props}
    >
      {children}
    </Link>
  );
}

```

---

### 2. In Plain React / SPA (Dynamic Import Prefetching)

In standard React SPAs using `React.lazy()` or React Router, "prefetching" means downloading the code-split route chunk and pre-warming the cache before navigation.

```tsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

// Code-split component with exported factory
const ProductPageFactory = () => import('./pages/ProductPage');
const ProductPage = React.lazy(ProductPageFactory);

export function PrefetchLink({ to, prefetchFactory, children, ...props }) {
  const hasPrefetched = useRef(false);

  const triggerPrefetch = () => {
    if (!hasPrefetched.current && typeof prefetchFactory === 'function') {
      prefetchFactory(); // Triggers browser chunk download
      hasPrefetched.current = true;
    }
  };

  return (
    <Link
      to={to}
      onMouseEnter={triggerPrefetch}
      onFocus={triggerPrefetch}
      {...props}
    >
      {children}
    </Link>
  );
}

// Usage:
// <PrefetchLink to="/product/123" prefetchFactory={ProductPageFactory}>
//   View Product
// </PrefetchLink>

```

---

### 3. Native Full-Page Prerendering via Speculation Rules API

For multi-page architectures or hard navigations, you can dynamically insert **Speculation Rules** on hover to make the browser silently render the next page in an invisible background tab:

```tsx
'use client';

import React from 'react';

export function PrerenderOnHoverLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handlePointerEnter = () => {
    // Check if Speculation Rules are supported by the browser (Chromium 109+)
    if (
      HTMLScriptElement.supports &&
      HTMLScriptElement.supports('speculationrules')
    ) {
      // Check if a rule for this href already exists
      const existing = document.querySelector(
        `script[data-prerender="${href}"]`
      );
      if (!existing) {
        const specScript = document.createElement('script');
        specScript.type = 'speculationrules';
        specScript.dataset.prerender = href;
        specScript.textContent = JSON.stringify({
          prerender: [
            {
              source: 'list',
              urls: [href],
              eagerness: 'immediate',
            },
          ],
        });
        document.head.appendChild(specScript);
      }
    }
  };

  return (
    <a href={href} onPointerEnter={handlePointerEnter} {...props}>
      {children}
    </a>
  );
}

```

---

### Best Practices

* **Debounce Hover Triggers (60–120ms):** Prevents spamming server routes when a user quickly moves their mouse across a dense list of links.
* **Support Focus Events (`onFocus`):** Ensures keyboard and screen-reader users get the same prefetching benefits.
* **Avoid Prefetching Mutating Routes:** Never prefetch URLs that perform state changes, logging out, or purchasing (`/api/logout`, `/cart/checkout/confirm`).
* **Check Data-Saver Mode:** Skip prefetching when users are on metered connections:

```javascript
const isSaveData = navigator.connection?.saveData === true;

```
