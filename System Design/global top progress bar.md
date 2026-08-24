A production-ready global top progress bar (similar to NProgress, YouTube, or GitHub's loading bar) looks simple on the surface, but requires addressing edge cases like concurrent requests, micro-delays, perceived performance, error states, and framework-agnostic architecture.

---

### Core Architecture & State Machine

The lifecycle of the progress bar transitions across four distinct states:

```
  [IDLE] 
     │ (1st request starts)
     ▼
 [PENDING] ──(exceeds 100ms threshold)──► [TRICKLING]
     │                                         │
     │ (all requests settle)                   │ (all requests settle / fail)
     └─────────────────┬───────────────────────┘
                       ▼
                 [COMPLETING] ──► [FADING] ──► [IDLE]

```

#### State Definitions

* **`IDLE`**: Hidden, width $0\%$, opacity $0$.
* **`PENDING`**: Request received, but waiting out a brief delay (e.g., $100\text{ms}$) to prevent UI flickering on fast requests.
* **`TRICKLING`**: Active progress bar visible; increments asymptotically toward a maximum cap (e.g., $90\%$).
* **`COMPLETING`**: Reaches $100\%$, transitions to error styling (red) if any request failed, then fades out and resets to `IDLE`.

---

### Key Architectural Challenges & Solutions

#### 1. Multiple Concurrent APIs (Reference Counting)

Tracking individual percentages across heterogeneous endpoints is impractical because individual request durations and sizes are rarely known in advance. Instead, use an **active request counter**:

* Every request increment: `activeRequests++`. If transitioning `0 -> 1`, start the timer.
* Every response/error/cancellation: `activeRequests--`. When count reaches `0`, complete the bar.

#### 2. Fast vs. Slow Requests (Debounce & Trickle)

* **Micro-requests ($<100\text{ms}$)**: If an API completes within $100\text{ms}$, the user should never see the progress bar. Showing a flash of $0\to100\%$ causes cognitive distraction.
* **Asymptotic Trickle**: Real APIs don't emit uniform progress events. Use an asymptotic decay curve so progress moves quickly from $0\% \to 30\%$, slows down around $70\%$, and asymptotically caps at $90\text{–}95\%$ until the final response resolves:

$$\Delta \text{progress} = \frac{100 - \text{currentProgress}}{k}$$

#### 3. Error Handling & Timeout Recovery

* **Network Error / 5xx**: If an active request errors out, flash the bar **red** before completing to give instant visual feedback.
* **Hung Requests / Zombie Timers**: Set a fallback global safety timeout (e.g., $15\text{–}20\text{s}$) that forces `activeRequests = 0` and terminates the bar to prevent a permanently stuck UI.

#### 4. Request Cancellation (`AbortController`)

When a request is aborted by the client (e.g., route transition, user cancellation), the interceptor's cleanup handler must still decrement the counter. Abortions should finish neutrally (not as a red failure state).

---

### Complete Framework-Agnostic Implementation

#### 1. The Core Engine (`ProgressBar.js`)

```javascript
class GlobalProgressBar {
  constructor(options = {}) {
    this.options = {
      trickleSpeed: 250,
      minimum: 8,
      latencyThreshold: 100, // Do not show if request resolves faster than this
      trickleRate: 0.05,
      ...options
    };

    this.activeRequests = 0;
    this.hasError = false;
    this.status = 0;
    this.timer = null;
    this.latencyTimer = null;

    this._mountUI();
  }

  _mountUI() {
    this.el = document.createElement('div');
    this.el.className = 'global-progress-bar';
    this.el.innerHTML = '<div class="bar"><div class="peg"></div></div>';
    document.body.appendChild(this.el);
    this.bar = this.el.querySelector('.bar');
  }

  start() {
    this.activeRequests++;

    if (this.activeRequests === 1) {
      this.hasError = false;
      this.latencyTimer = setTimeout(() => {
        this._set(this.options.minimum);
        this._trickle();
      }, this.options.latencyThreshold);
    }
  }

  _trickle() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.status === 0 || this.status >= 90) return;
      // Exponential decay toward 90%
      const step = (90 - this.status) * 0.1;
      this._set(this.status + Math.max(step, 0.5));
      this._trickle();
    }, this.options.trickleSpeed);
  }

  _set(n) {
    this.status = Math.min(100, Math.max(0, n));
    this.el.classList.add('active');
    this.bar.style.transform = `translate3d(${this.status - 100}%, 0, 0)`;
  }

  error() {
    this.hasError = true;
  }

  done(force = false) {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }

    if (this.activeRequests === 0 || force) {
      this.activeRequests = 0;
      clearTimeout(this.latencyTimer);
      clearTimeout(this.timer);

      if (this.status === 0) return; // Finished before latencyThreshold; never rendered

      if (this.hasError) {
        this.el.classList.add('error');
      }

      this._set(100);

      setTimeout(() => {
        this.el.classList.remove('active');
        setTimeout(() => {
          this.el.classList.remove('error');
          this._set(0);
          this.status = 0;
        }, 300); // Wait for CSS opacity fade out
      }, 200);
    }
  }
}

export const progressBar = new GlobalProgressBar();

```

---

#### 2. GPU-Accelerated CSS Styles (`styles.css`)

Avoid modifying `width` directly, which triggers CPU-bound browser reflows (Layout). Use `transform: translate3d(...)` so animations run exclusively on the GPU compositor thread.

```css
.global-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  pointer-events: none;
  z-index: 99999;
  opacity: 0;
  transition: opacity 300ms ease-out;
}

.global-progress-bar.active {
  opacity: 1;
}

.global-progress-bar .bar {
  width: 100%;
  height: 100%;
  background: #2563eb; /* Primary accent */
  transform: translate3d(-100%, 0, 0);
  transition: transform 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
  will-change: transform;
}

/* Optional glowing head */
.global-progress-bar .peg {
  position: absolute;
  right: 0;
  width: 70px;
  height: 100%;
  box-shadow: 0 0 10px #2563eb, 0 0 5px #2563eb;
  opacity: 1;
  transform: rotate(3deg) translate(0px, -4px);
}

/* Error state */
.global-progress-bar.error .bar {
  background: #ef4444;
}
.global-progress-bar.error .peg {
  box-shadow: 0 0 10px #ef4444, 0 0 5px #ef4444;
}

```

---

#### 3. Network Interceptor Hook (Axios / Fetch)

**Axios Interceptor:**

```javascript
import axios from 'axios';
import { progressBar } from './ProgressBar';

axios.interceptors.request.use(
  (config) => {
    // Allow opting out via config: axios.get('/url', { skipProgressBar: true })
    if (!config.skipProgressBar) {
      progressBar.start();
    }
    return config;
  },
  (error) => {
    progressBar.done();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (!response.config?.skipProgressBar) {
      progressBar.done();
    }
    return response;
  },
  (error) => {
    if (!error.config?.skipProgressBar) {
      if (!axios.isCancel(error)) {
        progressBar.error();
      }
      progressBar.done();
    }
    return Promise.reject(error);
  }
);

```

**Global `window.fetch` Wrapper:**

```javascript
const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const [resource, config = {}] = args;
  const skip = config.skipProgressBar;

  if (!skip) progressBar.start();

  try {
    const response = await originalFetch(...args);
    if (!response.ok && !skip) {
      progressBar.error();
    }
    return response;
  } catch (err) {
    if (err.name !== 'AbortError' && !skip) {
      progressBar.error();
    }
    throw err;
  } finally {
    if (!skip) progressBar.done();
  }
};

```

---

### Edge Cases Summary Matrix

| Scenario                               | Risk                                  | Solution                                                                                  |
| -------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Instant Cache Hit ($<50\text{ms}$)** | Visual flickering / screen flash      | `latencyThreshold` delay ($100\text{ms}$) prevents rendering before resolution.           |
| **Simultaneous Parallel APIs**         | Premature completion or multiple bars | Single shared reference count (`activeRequests`). Completes only when count drops to $0$. |
| **Route Change / Abort**               | False error triggers                  | Check for `AbortError` or `axios.isCancel()` to avoid setting the red error state.        |
| **Rendering Jitter**                   | Main-thread blocking / dropped frames | Use `translate3d` instead of `width` to offload rendering to the compositor thread.       |
| **Background Polling**                 | Unwanted continuous loading bar       | Provide a `skipProgressBar: true` flag in the request metadata.                           |

Add true upload/download progress integration
Integrate with Next.js or React Router transitions
Implement accessible screen reader announcements

Here is how to extend the global progress bar system to support deterministic upload/download progress, SPA framework navigation transitions, and ARIA screen reader accessibility.

---

### 1. True Upload & Download Progress Integration

When an API exposes byte counts (via `Content-Length` or `XMLHttpRequest.upload`), you want to bypass the asymptotic trickle estimation and advance the bar deterministically.

To handle cases where some requests have known sizes while others run concurrently in the background, assign a **weight pool** where:

* Deterministic requests drive an absolute fraction of the bar ($0\text{–}100\%$).
* Multiple concurrent deterministic streams calculate an aggregate average: $\frac{\sum \text{loadedBytes}}{\sum \text{totalBytes}}$.

```javascript
class ExtendedProgressBar extends GlobalProgressBar {
  constructor(options) {
    super(options);
    this.trackedStreams = new Map(); // id -> { loaded, total }
  }

  // Register or update deterministic byte progress
  updateStreamProgress(id, loaded, total) {
    if (total > 0) {
      this.trackedStreams.set(id, { loaded, total });
      
      let sumLoaded = 0;
      let sumTotal = 0;
      for (const stream of this.trackedStreams.values()) {
        sumLoaded += stream.loaded;
        sumTotal += stream.total;
      }

      const aggregatePercentage = (sumLoaded / sumTotal) * 100;
      // Clamp between minimum and 99% until complete signal
      this._set(Math.max(this.options.minimum, Math.min(99, aggregatePercentage)));
    }
  }

  clearStream(id) {
    this.trackedStreams.delete(id);
  }
}

```

#### Fetch API with `ReadableStream` (Download Progress)

```javascript
async function fetchWithProgress(url, options = {}) {
  const streamId = Symbol('stream_id');
  progressBar.start();

  try {
    const response = await fetch(url, options);
    const contentLength = response.headers.get('content-length');
    
    if (!contentLength || !response.body) {
      // Fallback: No content-length header -> standard trickle handles it
      return response;
    }

    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          loaded += value.byteLength;
          progressBar.updateStreamProgress(streamId, loaded, total);
          controller.enqueue(value);
        }
      }
    });

    return new Response(stream, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (err) {
    if (err.name !== 'AbortError') progressBar.error();
    throw err;
  } finally {
    progressBar.clearStream(streamId);
    progressBar.done();
  }
}

```

#### Axios Upload Progress

```javascript
import axios from 'axios';

function uploadFile(url, file) {
  const streamId = Symbol('upload_id');
  const formData = new FormData();
  formData.append('file', file);

  progressBar.start();

  return axios.post(url, formData, {
    skipProgressBar: true, // Bypass generic interceptor to avoid double-counting
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        progressBar.updateStreamProgress(
          streamId,
          progressEvent.loaded,
          progressEvent.total
        );
      }
    }
  })
  .then((res) => {
    progressBar.done();
    return res;
  })
  .catch((err) => {
    if (!axios.isCancel(err)) progressBar.error();
    progressBar.done();
    throw err;
  })
  .finally(() => {
    progressBar.clearStream(streamId);
  });
}

```

---

### 2. Next.js App Router & React Router Integration

#### Next.js (App Router)

In modern Next.js, traditional router events (like `routeChangeStart`) are replaced with link interception and `usePathname`/`useSearchParams` tracking.

```tsx
'use client';

import { useEffect, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { progressBar } from '@/lib/ProgressBar';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Complete bar when pathname or query parameters change
  useEffect(() => {
    progressBar.done();
  }, [pathname, searchParams]);

  // 2. Intercept internal link clicks to start progress immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const isExternal = target.target === '_blank' || target.rel === 'external';
      const isAnchor = href?.startsWith('#');
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      if (href && !isExternal && !isAnchor && !isModified) {
        const nextUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (nextUrl.href !== currentUrl.href) {
          progressBar.start();
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

```

#### React Router (v6.4+ Data Routers)

React Router exposes a top-level `useNavigation` hook where `navigation.state` flips to `'loading'` or `'submitting'` during async loaders and actions.

```tsx
import { useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import { progressBar } from './ProgressBar';

export function RouteProgressBar() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'loading' || navigation.state === 'submitting') {
      progressBar.start();
    } else if (navigation.state === 'idle') {
      progressBar.done();
    }
  }, [navigation.state]);

  return null;
}

```

---

### 3. Accessible Screen Reader Announcements (a11y)

Visual progress bars are completely invisible to screen readers unless configured with proper ARIA attributes, live regions, and `prefers-reduced-motion` guards.

#### Semantic HTML Structure & ARIA Setup

Update the `_mountUI()` method in the core engine:

```javascript
_mountUI() {
  // Container wrapper
  this.el = document.createElement('div');
  this.el.className = 'global-progress-bar';
  
  // Visual bar with ARIA attributes
  this.el.innerHTML = `
    <div 
      class="bar" 
      role="progressbar" 
      aria-label="Page loading progress"
      aria-valuemin="0" 
      aria-valuemax="100" 
      aria-valuenow="0"
    >
      <div class="peg"></div>
    </div>
    <!-- Off-screen live region for screen reader alerts -->
    <div 
      class="sr-only" 
      aria-live="polite" 
      aria-atomic="true"
      id="global-progress-announcer"
    ></div>
  `;
  
  document.body.appendChild(this.el);
  this.bar = this.el.querySelector('.bar');
  this.announcer = this.el.querySelector('#global-progress-announcer');
}

```

#### Screen Reader Announcements & Throttle

Screen readers should not announce every micro-percentage increment (which causes auditory clutter). Instead, announce:

1. **Start**: "Loading content..."
2. **Failure**: "Loading failed."
3. **Completion**: "Page loaded."

```javascript
_announce(message) {
  if (this.announcer) {
    this.announcer.textContent = message;
    // Clear after announcement to prepare for next update
    setTimeout(() => {
      if (this.announcer) this.announcer.textContent = '';
    }, 1000);
  }
}

// Attach to lifecycle transitions:
// In start():
this._announce('Loading content...');

// In error():
this._announce('Error loading content.');

// In done():
this._announce('Content loaded.');

```

#### Reduced Motion & Screen-Reader CSS

```css
/* Screen-reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Accessibility: Respect user prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .global-progress-bar .bar {
    /* Disable smooth slide animations; step discretely or use an opacity pulse */
    transition: none !important;
  }
  
  .global-progress-bar.active {
    animation: simple-pulse 1.5s infinite ease-in-out;
  }
}

@keyframes simple-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

```
