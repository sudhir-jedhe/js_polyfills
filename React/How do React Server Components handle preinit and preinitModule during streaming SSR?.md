*** copy How do React Server Components handle preinit and preinitModule during streaming SSR?.md ***

During streaming Server-Side Rendering (SSR) with React Server Components (RSC), `preinit` and `preinitModule` act as **early discovery mechanisms**. They allow the server to discover required external scripts and stylesheets during the component rendering pass on the server and stream the corresponding `<script>` or `<link>` tags directly to the browser before the component’s HTML content even finishes streaming.

---

**1. How the Streaming Pipeline Processes `preinit**`

When rendering an RSC tree to a stream (e.g., using `renderToReadableStream` or `renderToPipeableStream`), React executes components top-down:

```
[Server: RSC Rendering Stream]
   │
   ├── Component encountered: calls `preinit('/sdk.js', { as: 'script' })`
   │      │
   │      ▼
   │   [React Server Renderer] extracts the resource hint immediately.
   │      │
   │      ▼
   ├── Chunk 1 (HTML Head / Early Stream Chunk):
   │   `<script async src="/sdk.js"></script>` is flushed immediately into the HTTP response.
   │
   └── Chunk 2...N (Async Content / Suspense Chunks):
       Component awaits database query `await db.query(...)` and streams HTML later.

```

By the time the server finishes fetching data and streams the actual HTML payload for that component, the browser has already received the `<script async>` or `<link rel="stylesheet">` tag in an earlier chunk and started downloading and evaluating it in parallel.

---

**2. Deduplication Across the Server Stream**

Because RSC streams chunks progressively, multiple independent components might invoke `preinit` for the same asset:

```tsx
// Server Component A
import { preinit } from 'react-dom';

export async function AnalyticsWidget() {
  preinit('https://cdn.example.com/telemetry.js', { as: 'script' });
  const data = await fetchAnalytics();
  return <div>{data.summary}</div>;
}

// Server Component B (rendered in the same tree)
export async function UserTracker() {
  preinit('https://cdn.example.com/telemetry.js', { as: 'script' });
  return <div>Tracking active</div>;
}

```

* **Server-Side Registry:** React’s server renderer tracks an internal registry of dispatched resource URLs for the current stream session.
* **Single Injection:** Even if `AnalyticsWidget` and `UserTracker` are rendered in separate `<Suspense>` boundaries that resolve at different times, React emits `<script async src="[https://cdn.example.com/telemetry.js](https://cdn.example.com/telemetry.js)"></script>` into the stream **only once**.

---

**3. Integration with Suspense and Fallback Boundaries**

When `preinit` is used with stylesheets (`as: 'style'`), React coordinates with streaming `<Suspense>` boundaries:

```tsx
import { Suspense } from 'react';
import { preinit } from 'react-dom';

async function HeavyReport() {
  // 1. Injects stylesheet with precedence
  preinit('/styles/report.css', { as: 'style', precedence: 'high' });
  
  // 2. Slow server data fetch
  const reportData = await getReportData();
  return <div className="report-grid">{reportData.title}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Report...</div>}>
      <HeavyReport />
    </Suspense>
  );
}

```

* While `HeavyReport` is suspended awaiting `getReportData()`, the server emits the `<Suspense>` fallback HTML immediately along with the stylesheet hint.
* The browser receives the stylesheet link and downloads the CSS.
* When the server stream flushes the completed `HeavyReport` HTML, the browser already has the styles loaded, preventing Flash of Unstyled Content (FOUC).

---

**4. `preinit` vs. `preinitModule` in Streaming Output**

React emits standard modern HTML tags tailored to script types:

| API in RSC                                           | Emitted Streaming Tag                                       | Browser Behavior                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `preinit(href, { as: 'script' })`                    | `<script async src="..."></script>`                         | Fetches and runs as a standard asynchronous global script.                           |
| `preinit(href, { as: 'style', precedence: 'high' })` | `<link rel="stylesheet" href="..." data-precedence="high">` | Injected according to cascade precedence; suspends associated boundary until parsed. |
| `preinitModule(href, { as: 'script' })`              | `<script type="module" async src="..."></script>`           | Fetches and runs as an ES Module, honoring module scoping and imports.               |

---

**Key Operational Differences: Server vs. Client**

* **On the Server (RSC / Streaming SSR):**
Calls to `preinit` write `<script>` and `<link>` tags directly into the streaming HTML output chunks. They do not execute JavaScript or fetch network files on the Node.js/Edge runtime.
* **On the Client (Hydration & SPA Navigation):**
If a Client Component triggers `preinit` dynamically during navigation, React checks the DOM for existing elements and dynamically appends the tag to `document.head` if not already present.
