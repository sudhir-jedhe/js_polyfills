***  Show how to monitor and log real user Core Web Vitals (RUM) using the web-vitals library in React.md ***

To capture Real User Monitoring (RUM) data for Core Web Vitals (LCP, INP, CLS, FCP, TTFB), use Google's official `web-vitals` library and report metrics to an analytics endpoint or custom backend using `navigator.sendBeacon`.

---

### Step 1: Install the Dependency

```bash
npm install web-vitals
# or
pnpm add web-vitals

```

---

### Step 2: Create the Web Vitals Reporter

Create a utility module that listens for metrics and flushes them reliably without blocking page unload:

```typescript
// src/reportWebVitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

const ANALYTICS_ENDPOINT = '/api/analytics/vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,                  // 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
    value: metric.value,                // Numeric score (e.g. milliseconds or shift score)
    rating: metric.rating,              // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,                // Change since last measurement
    id: metric.id,                      // Unique ID for current page load
    navigationType: metric.navigationType, // 'navigate' | 'reload' | 'back-forward' | 'prerender'
    page: window.location.pathname,
    timestamp: Date.now(),
  });

  // Use sendBeacon to guarantee delivery even if the user closes the tab
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, body);
  } else {
    fetch(ANALYTICS_ENDPOINT, {
      body,
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export function initWebVitals(onPerfEntry = sendToAnalytics) {
  // Pass reportAllChanges: true if you want intermediate states (optional)
  onCLS(onPerfEntry);
  onINP(onPerfEntry);
  onLCP(onPerfEntry);
  onFCP(onPerfEntry);
  onTTFB(onPerfEntry);
}

```

---

### Step 3: Initialize in Your Application

Initialize the reporter inside your React root entry point:

```typescript
// src/main.tsx or src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initWebVitals } from './reportWebVitals';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize after mounting
initWebVitals((metric) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      entries: metric.entries,
    });
  }
});

```

---

### Step 4: Tracking with Next.js (Built-in Alternative)

If you use the Next.js App Router, Next.js provides the `useReportWebVitals` hook natively without needing manual `web-vitals` setup:

```tsx
// app/_components/WebVitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify(metric);
    const url = '/api/analytics/vitals';

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  });

  return null;
}

```

Add `<WebVitals/>` to your root layout (`app/layout.tsx`).

---

### Step 5: Advanced Attribution (Finding the Culprit Element)

To identify the exact DOM node or script causing high INP, LCP, or CLS, import from `web-vitals/attribution`:

```typescript
import { onINP, onLCP, onCLS, type INP墮MetricWithAttribution } from 'web-vitals/attribution';

onINP((metric) => {
  console.log('Slowest interaction target:', metric.attribution.interactionTarget);
  console.log('Interaction type:', metric.attribution.interactionType); // 'pointer' | 'keyboard'
  console.log('Load/Event delays:', {
    inputDelay: metric.attribution.inputDelay,
    processingDuration: metric.attribution.processingDuration,
    presentationDelay: metric.attribution.presentationDelay,
  });
});

onLCP((metric) => {
  console.log('LCP Element selector:', metric.attribution.element);
  console.log('LCP Resource URL:', metric.attribution.url);
});

```
