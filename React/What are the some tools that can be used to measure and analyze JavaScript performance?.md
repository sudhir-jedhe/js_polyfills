JavaScript performance analysis spans several layers: browser runtime execution, bundle sizes, memory leaks, and real-user monitoring (RUM).

---

### 1. In-Browser Runtime & Profiling Tools

**Chrome DevTools (Performance & Memory Panels)**

* **Performance Panel:** Profiles CPU execution, main-thread blocking time, long tasks (>50ms), layout reflows, and Core Web Vitals (LCP, CLS, INP) using flame charts.
* **Memory Panel (Heap Snapshots & Allocation Timelines):** Identifies detached DOM nodes, memory leaks, closures retaining references, and garbage collection churn.
* **Coverage Tab:** Identifies unused JavaScript and CSS shipped to the client to guide code-splitting.

**WebPageTest**

* Deep multi-location, multi-device synthetic testing with waterfall visualizations, CPU utilization timelines, and Script Execution maps.

**Lighthouse**

* Audits total blocking time (TBT), JavaScript execution time, main-thread work breakdown, and third-party script impact.

---

### 2. Programmatic & Benchmarking APIs

**Performance Observer & User Timing API**

* Built directly into the browser for fine-grained runtime telemetry:

```javascript
// Custom marker for function execution
performance.mark('work-start');
heavyComputation();
performance.mark('work-end');
performance.measure('heavyComputation', 'work-start', 'work-end');

const entries = performance.getEntriesByName('heavyComputation');
console.log(`Execution time: ${entries[0].duration} ms`);

```

**`web-vitals` JavaScript Library**

* Official Google library for capturing real-user Core Web Vitals (INP, LCP, CLS, FCP, TTFB) in production and reporting to analytics backends.

**Benchmark.js / Tinybench**

* Micro-benchmarking libraries for comparing execution speeds of individual JavaScript algorithms and functions with statistical sampling.

---

### 3. Bundle Analysis & Tree-Shaking Profilers

| Tool                         | Focus Area                  | Best Used For                                                    |
| ---------------------------- | --------------------------- | ---------------------------------------------------------------- |
| **Webpack Bundle Analyzer**  | Bundle visualization        | Interactive zoomable treemap of Webpack bundle chunks            |
| **`@next/bundle-analyzer`**  | Next.js build output        | Inspecting client vs. server bundle weights per route            |
| **Rollup Plugin Visualizer** | Vite / Rollup               | Visualizing chunks and dependencies in Vite projects             |
| **Bundlephobia**             | Package sizing              | Inspecting npm dependency size and export cost before installing |
| **Source Map Explorer**      | Minified production bundles | Analyzing byte distribution directly from sourcemaps             |

---

### 4. Node.js & Backend Profiling

**Node.js Built-in V8 Profiler & `--inspect**`

* Profiles backend CPU and heap usage directly in Chrome DevTools or VS Code:

```bash
node --inspect --prof server.js

```

**0x / Clinic.js**

* **Clinic.js (Doctor, Flame, Bubbleprof):** Diagnoses Node.js event loop lag, I/O bottlenecks, and CPU hotspots.
* **0x:** Generates interactive flamegraphs to identify slow function calls in Node.js.

---

### 5. Production Real User Monitoring (RUM) & APM

* **Sentry / Datadog APM / New Relic:** Tracks client-side unhandled errors, transaction tracing, and real-time slow interaction telemetry (INP bottlenecks).
* **SpeedCurve / Calibre:** Continuous automated performance tracking with synthetic and RUM alerting across releases.
