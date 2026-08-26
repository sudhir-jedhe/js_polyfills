// app/layout.tsx (or a dedicated client component imported into it)
// Reporting Core Web Vitals (LCP, CLS, INP) to an analytics endpoint
// using Next.js's built-in useReportWebVitals hook.

'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // metric.name is one of: 'LCP', 'CLS', 'INP', 'FCP', 'TTFB'
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      page: window.location.pathname,
    });

    // navigator.sendBeacon avoids blocking navigation/unload with a
    // synchronous request when the page is closing.
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/vitals', body);
    } else {
      fetch('/api/vitals', { body, method: 'POST', keepalive: true });
    }
  });

  return null;
}

// app/layout.tsx
// import { WebVitalsReporter } from './web-vitals-reporter';
//
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <WebVitalsReporter />
//         {children}
//       </body>
//     </html>
//   );
// }
