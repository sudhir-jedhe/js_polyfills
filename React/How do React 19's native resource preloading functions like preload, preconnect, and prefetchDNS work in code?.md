*** copy How do React 19's native resource preloading functions like preload, preconnect, and prefetchDNS work in code?.md ***

React 19 introduces a set of native **Resource Preloading APIs** exported directly from `react-dom`. These functions instruct the browser to warm up network connections, fetch critical assets early, and preload scripts, stylesheets, and fonts without requiring manual `<link>` tags in raw HTML or third-party document head managers.

They are designed to be called anywhere—**inside component bodies, event handlers, loaders, or server actions**—and React automatically handles deduplication and injects the corresponding `<link>` hints into the document `<head>`.

---

**The Core Preloading APIs**

```tsx
import { 
  preload, 
  preloadModule, 
  preconnect, 
  prefetchDNS 
} from 'react-dom';

```

---

**1. `prefetchDNS(href)`: Early DNS Resolution**

Tells the browser to resolve the IP address of an external domain before any actual HTTP request is initiated.

* **Best used for:** External domains you know the user will likely request data or assets from soon (e.g., third-party CDNs, analytics, external APIs).

```tsx
import { prefetchDNS } from 'react-dom';

function App() {
  // Resolves the DNS for the CDN domain ahead of time
  prefetchDNS('https://cdn.example.com');

  return <div>App Content</div>;
}

```

* **HTML emitted to `<head>`:**

```html
<link rel="dns-prefetch" href="https://cdn.example.com">

```

---

**2. `preconnect(href)`: Full Early Network Handshake**

Goes one step further than DNS prefetching: it resolves the DNS, completes the TCP handshake, and negotiates the TLS/SSL certificate.

* **Best used for:** High-priority third-party endpoints that are guaranteed to be called immediately (e.g., Google Fonts, payment gateway origins, authenticated API hosts).

```tsx
import { preconnect } from 'react-dom';

function CheckoutPage() {
  // Opens TCP + TLS connection to Stripe before user hits "Pay"
  preconnect('https://api.stripe.com');

  return <form>Payment Details...</form>;
}

```

* **HTML emitted to `<head>`:**

```html
<link rel="preconnect" href="https://api.stripe.com">

```

---

**3. `preload(href, options)`: Early Asset Fetching**

Instructs the browser to begin downloading and caching a specific critical resource (stylesheets, fonts, images, scripts) with high priority before the browser encounters it in the DOM.

* **Signature options:** `{ as: 'style' | 'font' | 'image' | 'script' | 'fetch', type?, crossOrigin?, fetchPriority?, integrity? }`

```tsx
import { preload } from 'react-dom';

function ProductDetails({ product }) {
  // Preload high-priority hero image and custom brand font
  preload(product.heroImageUrl, { 
    as: 'image', 
    fetchPriority: 'high' 
  });
  
  preload('/fonts/inter-bold.woff2', { 
    as: 'font', 
    type: 'font/woff2', 
    crossOrigin: 'anonymous' 
  });

  return (
    <div>
      <img src={product.heroImageUrl} alt={product.title} />
    </div>
  );
}

```

* **HTML emitted to `<head>`:**

```html
<link rel="preload" href="/fonts/inter-bold.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="https://.../hero.webp" as="image" fetchpriority="high">

```

---

**4. `preloadModule(href, options)`: Early ES Module Chunk Fetching**

Specifically designed to preload JavaScript ES modules (`<link rel="modulepreload">`).

* **Best used for:** Pre-fetching dynamic route chunks, heavy lazy-loaded components, or client-side chart libraries.

```tsx
import { preloadModule } from 'react-dom';

function DashboardCard() {
  const handleMouseEnter = () => {
    // Speculatively fetch the heavy bundle on hover
    preloadModule('/chunks/HeavyAnalyticsChart.js');
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <h3>Analytics Summary</h3>
    </div>
  );
}

```

* **HTML emitted to `<head>`:**

```html
<link rel="modulepreload" href="/chunks/HeavyAnalyticsChart.js">

```

---

**Calling Preload APIs Inside Event Handlers vs. Component Renders**

These functions work in both synchronous render passes and event-driven user interactions:

```tsx
import { preload, preloadModule } from 'react-dom';

function NavigationLink({ href, targetChunk, nextHeroImg }) {
  const handleHover = () => {
    // 1. Warm up the JS module chunk for the next route
    preloadModule(targetChunk);

    // 2. Pre-fetch the hero image of that destination page
    preload(nextHeroImg, { as: 'image' });
  };

  return (
    <a href={href} onMouseEnter={handleHover} onFocus={handleHover}>
      Explore Next Page
    </a>
  );
}

```

---

**Key Behaviors and Guarantees**

| Feature                         | Behavior in React 19                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Automatic Deduplication**     | Calling `preload('/font.woff2', ...)` 50 times across different child instances emits only **one** `<link>` element in `<head>`.                                        |
| **Server & Client Unification** | Works during Server-Side Rendering (SSR/RSC) by streaming the `<link>` hints into initial HTML headers, and on the client via dynamic DOM insertion.                    |
| **Suspense Integration**        | Preloading resources initiates the network request early so that when a `<Suspense>` boundary triggers or resolves, the required asset is already cached or mid-flight. |
| **Zero Cleanup Required**       | You do not need `useEffect` cleanup routines; React manages the lifecycle of the hoisted DOM links.                                                                     |
