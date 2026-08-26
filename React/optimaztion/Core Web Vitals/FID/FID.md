*** copy FID.md ***

**First Input Delay (FID)** is a legacy Core Web Vitals metric that measures page responsiveness and interactivity. It tracks the time from when a user **first interacts** with a page (e.g., clicks a link, taps a button, or uses a custom control) to the time when the browser is actually able to begin processing the event handlers in response to that interaction.

> **Status Update:** Google officially replaced FID with **Interaction to Next Paint (INP)** as a Core Web Vital. While FID only measured the delay of the *first* interaction, INP measures the overall responsiveness across *all* interactions during a page session.

---

### 1. Scoring Thresholds

FID focuses purely on input latency (delay) at the 75th percentile of user sessions:

| Rating                | Threshold                       | Experience                                           |
| --------------------- | ------------------------------- | ---------------------------------------------------- |
| **Good**              | $\le 100\text{ ms}$             | Immediate and responsive.                            |
| **Needs Improvement** | $100\text{ ms} - 300\text{ ms}$ | Slight noticeable lag on first tap/click.            |
| **Poor**              | $> 300\text{ ms}$               | Noticeable freeze; users may double-click or bounce. |

---

### 2. Why Does Input Delay Happen?

Input delay primarily occurs when the browser's **Main Thread is blocked** executing long JavaScript tasks.

When a user clicks a button while the main thread is busy parsing, compiling, or executing a heavy JavaScript bundle:

1. The browser queues the user input event behind the running JavaScript tasks.
2. The user experiences a delay until the main thread finishes its current task.
3. Once the main thread is free, it finally processes the event listener attached to the button.

```
Main Thread: [ Heavy JS Task Execution (e.g., 250ms) ] -> [ Event Listener Executes ]
                     ▲
User clicks button here (waits for JS task to finish = FID)

```

---

### 3. What Counts as an Interaction for FID?

* **Qualifies:** Discrete input actions where the main thread must run event listeners (e.g., clicking links/buttons, text input focus, selecting dropdown options, tapping interactive elements on mobile).
* **Does Not Qualify:** Continuous actions like scrolling or zooming, as these are typically handled off the main thread by the browser's compositor thread.

---

### 4. Strategies to Optimize FID / Input Responsiveness

* **Break Up Long Tasks:** Any task exceeding $50\text{ ms}$ is considered a "long task." Use `scheduler.yield()`, `requestIdleCallback()`, or `setTimeout()` to break monolithic execution blocks into smaller micro-chunks.
* **Reduce JavaScript Execution Time:**
* Code-split large bundles using dynamic `import()` so only essential code loads initially.
* Tree-shake unused dependencies and eliminate duplicate modules.

* **Defer Non-Critical Scripts:** Mark third-party analytics and non-essential scripts with `defer` or `async` to keep the main thread clear during hydration.
* **Offload Computation to Web Workers:** Move heavy data processing, encryption, or image manipulation to a dedicated background worker thread so the main UI thread remains unblocked.

---

### 5. Measuring FID in JavaScript

You can measure FID in field environments using the `PerformanceObserver` API:

```javascript
const observer = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // Delay = processing start time minus interaction start time
    const inputDelay = entry.processingStart - entry.startTime;
    console.log('FID (ms):', inputDelay);
    console.log('Event Name:', entry.name);
    console.log('Target Element:', entry.target);
  }
});

observer.observe({ type: 'first-input', buffered: true });

```
