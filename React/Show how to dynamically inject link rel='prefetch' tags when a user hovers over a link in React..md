***  Show how to dynamically inject link rel='prefetch' tags when a user hovers over a link in React..md ***

Here is a production-ready, reusable `PrefetchLink` component in React that dynamically injects `<link rel="prefetch">` tags into `<head>` when a user hovers over (or focuses on) a link.

It includes deduplication to prevent injecting duplicate tags, a slight debounce (50ms–100ms) to avoid spamming the network when a user rapidly sweeps their cursor across the page, and mobile touch support.

---

### 1. Prefetch Utility Helper (`prefetchUtils.js`)

Centralizes prefetch tracking using a `Set` to ensure the DOM is never polluted with duplicate tags for the same resource.

```javascript
// src/utils/prefetchUtils.js

// In-memory registry of already prefetched URLs
const prefetchedUrls = new Set();

/**
 * Dynamically creates and appends a <link rel="prefetch"> tag to document head.
 * @param {string} url - Target URL/asset to prefetch.
 * @param {string} [asType] - Optional resource type (e.g., 'script', 'document', 'fetch', 'image').
 */
export function prefetchResource(url, asType = 'document') {
  if (!url || typeof document === 'undefined') return;

  // 1. Skip if already prefetched in this session
  if (prefetchedUrls.has(url)) return;

  // 2. Skip if already declared statically in the DOM
  const existingLink = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existingLink) {
    prefetchedUrls.add(url);
    return;
  }

  // 3. Create and append the link tag
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  if (asType) {
    link.as = asType;
  }

  document.head.appendChild(link);
  prefetchedUrls.add(url);
}

```

---

### 2. Reusable `PrefetchLink` Component (`PrefetchLink.jsx`)

Listens to `onMouseEnter`, `onFocus` (keyboard navigation), and `onTouchStart` (mobile), with a brief 60ms debounce.

```jsx
// src/components/PrefetchLink.jsx
import React, { useRef } from 'react';
import { prefetchResource } from '../utils/prefetchUtils';

export function PrefetchLink({
  to,
  children,
  asType = 'document',
  prefetchTimeout = 60, // 60ms delay ensures intentional hover
  onClick,
  ...restProps
}) {
  const timerRef = useRef(null);

  const startPrefetchTimer = () => {
    // Clear any active timer before starting a new one
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      prefetchResource(to, asType);
    }, prefetchTimeout);
  };

  const cancelPrefetchTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <a
      href={to}
      onMouseEnter={startPrefetchTimer}
      onMouseLeave={cancelPrefetchTimer}
      onFocus={startPrefetchTimer} // Supports keyboard accessibility
      onBlur={cancelPrefetchTimer}
      onTouchStart={startPrefetchTimer} // Immediate prefetch on mobile tap/touch
      onClick={onClick}
      {...restProps}
    >
      {children}
    </a>
  );
}

```

---

### 3. Example Usage in Navigation (`Navigation.jsx`)

```jsx
// src/components/Navigation.jsx
import React from 'react';
import { PrefetchLink } from './PrefetchLink';

export default function Navigation() {
  return (
    <nav style={{ display: 'flex', gap: '1.5rem', padding: '1rem', background: '#f5f5f5' }}>
      <PrefetchLink to="/dashboard" asType="document">
        Dashboard
      </PrefetchLink>

      <PrefetchLink to="/products" asType="document">
        Products
      </PrefetchLink>

      {/* Prefetching a heavy script or data endpoint ahead of time */}
      <PrefetchLink 
        to="/assets/checkout-bundle.js" 
        asType="script"
        style={{ fontWeight: 'bold', color: '#0070f3' }}
      >
        Checkout (Prefetch Script)
      </PrefetchLink>
    </nav>
  );
}

```

---

### Key Optimizations

* **Debouncing Hover (60ms):** Prevents network congestion caused by accidental mouse movements over menus.
* **Global Set Tracking:** Ensures each URL is appended to `<head>` exactly once, saving DOM operations.
* **Accessibility Support (`onFocus`):** Users navigating with `Tab` keys trigger the same prefetching behavior.
* **Inspection:** You can verify it works by opening DevTools **Elements** panel (inspect `<head>`) and **Network** panel (filter by `Fetch/XHR` or `Other`, watching for lowest-priority requests).
