***  How do you integrate Google Core Web Vitals (INP, LCP, CLS) tracking into a React application using the web-vitals package?.md ***

Integrating Google Core Web Vitals into a React application involves measuring the standard metrics (**LCP**, **CLS**, and **INP**, which replaced FID as a Core Web Vital) using Google's official `web-vitals` package, and transmitting those values to an analytics endpoint or Google Analytics.

---

**Step 1: Install the Package**

```bash
npm install web-vitals

```

---

**Step 2: Create the Web Vitals Reporter Module**

Use `navigator.sendBeacon` (with a `fetch` fallback with `keepalive: true`) to ensure metrics are reliably delivered even if the user closes the tab or navigates away.

```typescript
// reportWebVitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,        // e.g. 'LCP', 'INP', 'CLS'
    value: metric.value,      // Numeric value (ms or score)
    rating: metric.rating,    // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,      // Change since last reported value
    id: metric.id,            // Unique ID for the metric instance
    navigationType: metric.navigationType, // 'navigate' | 'reload' | 'back-forward'
  });

  const url = '/api/vitals';

  // sendBeacon ensures payload delivery during page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    });
  }
}

export function reportWebVitals(onPerfEntry = sendToAnalytics) {
  // Core Web Vitals
  onCLS(onPerfEntry); // Cumulative Layout Shift
  onLCP(onPerfEntry); // Largest Contentful Paint
  onINP(onPerfEntry); // Interaction to Next Paint

  // Additional Diagnostics
  onFCP(onPerfEntry);  // First Contentful Paint
  onTTFB(onPerfEntry); // Time to First Byte
}

```

---

**Step 3: Initialize in the React Application Root**

Call the reporter once at your application's entry point (`main.tsx` / `index.js`).

```tsx
// main.tsx (Vite / CRA)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { reportWebVitals } from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Start tracking after the root is mounted
reportWebVitals();

```

---

**Sending Directly to Google Analytics 4 (GA4)**

If you use Google Analytics (`gtag`), forward the metrics directly as custom events:

```typescript
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

function sendToGoogleAnalytics({ name, delta, value, id, rating }: Metric) {
  // Ensure gtag is loaded on window
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      // Google Analytics metrics must be integers
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      event_label: id,
      metric_rating: rating,
      metric_value: value,
      non_interaction: true, // Prevents skewing bounce rate
    });
  }
}

export function initGAWebVitals() {
  onCLS(sendToGoogleAnalytics);
  onINP(sendToGoogleAnalytics);
  onLCP(sendToGoogleAnalytics);
  onFCP(sendToGoogleAnalytics);
  onTTFB(sendToGoogleAnalytics);
}

```

---

**Next.js Built-In Alternative (`useReportWebVitals`)**

If you are using **Next.js**, the `web-vitals` library is already integrated natively:

* **App Router:**

```tsx
// app/_components/WebVitals.tsx
'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
    // forward to analytics endpoint
  });
  return null;
}

```

*(Include `<WebVitals/>` inside your root `app/layout.tsx`)*

---

**Core Web Vitals Thresholds Reference**

| Metric                              | Good (Target)       | Needs Improvement               | Poor              |
| ----------------------------------- | ------------------- | ------------------------------- | ----------------- |
| **LCP** (Largest Contentful Paint)  | $\le 2.5\text{ s}$  | $2.5\text{ s} - 4.0\text{ s}$   | $> 4.0\text{ s}$  |
| **INP** (Interaction to Next Paint) | $\le 200\text{ ms}$ | $200\text{ ms} - 500\text{ ms}$ | $> 500\text{ ms}$ |
| **CLS** (Cumulative Layout Shift)   | $\le 0.1$           | $0.1 - 0.25$                    | $> 0.25$          |
