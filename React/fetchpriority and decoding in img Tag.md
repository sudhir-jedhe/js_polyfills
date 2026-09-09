***  fetchpriority and decoding in img Tag.md ***

Both `fetchpriority` and `decoding` are modern HTML attributes used on `<img>` tags to optimize browser resource scheduling, reduce render-blocking, and improve Core Web Vitals (specifically **LCP** and **INP**).

---

### Comparison & Core Purpose

| Attribute           | Controls                                                 | Key Problem It Solves                                        | Best Used For                                        |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| **`fetchpriority`** | **Network download priority** (when bytes are requested) | Prevents low-importance assets from delaying critical assets | Boosting LCP images; deprioritizing offscreen images |
| **`decoding`**      | **CPU image decompression** (when pixels are rasterized) | Prevents main-thread jank/frame drops during decoding        | Keeping UI responsive while rendering large images   |

---

### 1. `fetchpriority` (Network Scheduling)

The `fetchpriority` attribute gives the browser an explicit hint about an image's download importance relative to other assets on the network waterfall.

* **Values:**
* `'high'`: Signals the browser to boost the image's priority ahead of other standard images/scripts.
* `'low'`: Deprioritizes the image (useful for off-screen carousels, thumbnails, or non-critical icons).
* `'auto'` (default): Lets the browser determine priority based on heuristics (position, layout, tags).

```html
<!-- Hero / LCP Image: Load immediately with high network priority -->
<img 
  src="/hero-banner.webp" 
  alt="Main promotional banner" 
  fetchpriority="high"
  width="1200" 
  height="600"
/>

<!-- Non-critical footer image: Deprioritized -->
<img 
  src="/footer-logo.webp" 
  alt="Company Logo" 
  fetchpriority="low" 
  loading="lazy"
  width="150" 
  height="50"
/>

```

> **Rule of Thumb:** Never combine `fetchpriority="high"` with `loading="lazy"`. They contradict each other: `lazy` delays fetching until near the viewport, while `high` tells the browser to fetch immediately with urgency.

---

### 2. `decoding` (CPU & Main-Thread Scheduling)

Before an image can be painted to the screen, the browser must decompress the raw image file (JPEG, PNG, WebP, AVIF) into memory. `decoding` controls whether this decoding process happens synchronously or asynchronously.

* **Values:**
* `'async'`: Decodes the image off the main thread (in parallel). Other DOM and rendering tasks are not blocked, eliminating UI jank/frame drops.
* `'sync'`: Decodes the image synchronously on the main thread, presenting it atomically with surrounding content (can cause micro-stutters for large images).
* `'auto'` (default): Lets the browser choose the optimal strategy.

```html
<!-- Off-thread decoding: Smooth scrolling, zero main-thread jank -->
<img 
  src="/large-photo.jpg" 
  alt="Product Showcase" 
  decoding="async"
  loading="lazy"
  width="800" 
  height="600"
/>

```

---

### Best Practices: The Ideal Configurations

**For the Hero / LCP Image (Above the Fold)**

```html
<img 
  src="/hero.webp" 
  alt="Hero"
  fetchpriority="high" 
  decoding="async"
  width="1200" 
  height="600"
/>

```

* Boosts network priority to download ASAP.
* Decodes asynchronously to keep the main thread available for JavaScript execution.
* Explicit `width` and `height` prevent layout shifts (CLS).

**For Below-the-Fold / Secondary Images**

```html
<img 
  src="/item.webp" 
  alt="Related Item"
  loading="lazy"
  fetchpriority="low" 
  decoding="async"
  width="400" 
  height="300"
/>

```

* Defers network request until scrolled into view.
* Avoids competing with critical assets for bandwidth.
* Decodes off the main thread to ensure 60fps scrolling.

Here is a detailed breakdown of how the browser processes an `<img>` tag across its three sequential pipeline stages: **Triggering**, **Downloading**, and **Decoding**.

---

```
  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │ 1. TRIGGERING   │ ────► │ 2. DOWNLOADING  │ ────► │  3. DECODING    │
  │ (loading)       │       │ (fetchpriority) │       │ (decoding)      │
  │ When to start?  │       │ Network queue?  │       │ CPU / Raster?   │
  └─────────────────┘       └─────────────────┘       └─────────────────┘

```

---

### Stage 1: Triggering — `loading` (When does the request start?)

Before sending any network packet, the browser's **Preload Scanner** and **DOM Parser** decide *when* the image is eligible to start fetching.

* **`loading="eager"` (Default):**
* **Mechanism:** The preload scanner flags the image URL immediately upon encountering it in the HTML stream—even if the image is far below the viewport.
* **When it fires:** Instantly during early HTML parsing.

* **`loading="lazy"`:**
* **Mechanism:** The browser defers the request. It calculates a dynamic distance threshold around the viewport (often 1000px–2000px ahead on fast networks, or less on mobile). Only when the user scrolls near that threshold does the browser hand the request over to Stage 2.
* **When it fires:** Only when the element approaches the visible viewport.

---

### Stage 2: Downloading — `fetchpriority` (How is bandwidth allocated?)

Once Stage 1 gives the green light, the request enters the browser's internal **Network Resource Scheduler**. The browser manages socket pools, HTTP/2/3 streams, and connection limits across all in-flight resources (HTML, CSS, JS, fonts, images).

* **`fetchpriority="auto"` (Default):**
* Images usually enter the queue at **`Low`** priority. If the browser determines through layout calculation that the image is in the initial viewport, it might upgrade the priority to **`Medium`** or **`High`** later—but that upgrade costs precious round-trip time.

* **`fetchpriority="high"`:**
* Forces the request straight into the network queue with **`High`** priority immediately from the preload scanner stage. It receives prioritized HTTP/2 multiplex stream weights and TCP socket bandwidth ahead of other standard images and non-critical scripts.

* **`fetchpriority="low"`:**
* Signals the browser to de-prioritize this stream, ensuring critical assets (like fonts, hero images, or main JS bundles) consume the available bandwidth first.

---

### Stage 3: Decoding — `decoding` (How are bytes converted to pixels?)

Downloading delivers compressed, raw binary data (e.g., JPEG, PNG, WebP, AVIF) into browser memory. The browser cannot paint compressed bytes directly onto the screen—the CPU must decompress those bytes into an uncompressed **RGBA Bitmap**.

* **`decoding="sync"`:**
* **Mechanism:** The decompression runs synchronously on the **Main Thread** during the next layout/render frame.
* **Trade-off:** The image and surrounding DOM elements paint together atomically in a single frame. However, decompressing a large image can lock the main thread for 15–50ms+, freezing JavaScript execution and causing frame drops / input delays (**INP** regression).

* **`decoding="async"`:**
* **Mechanism:** Decompression is offloaded to a background thread / worker pool.
* **Trade-off:** The main thread remains completely free for user interactions and JavaScript tasks. The element layout box may appear for a split second before the rasterized bitmap is composited onto the screen.

* **`decoding="auto"` (Default):**
* The browser uses its own heuristics (image dimensions, device CPU cores, viewport location) to decide whether to decode on or off the main thread.

---

### Summary of the Lifecycle

| Stage              | Controlled By           | Browser Subsystem | Question Answered                       |
| ------------------ | ----------------------- | ----------------- | --------------------------------------- |
| **1. Triggering**  | `loading` (`eager`      | `lazy`)           | Preload Scanner & Intersection Observer | *"Should we send the HTTP request now or wait for a scroll event?"* |
| **2. Downloading** | `fetchpriority` (`high` | `low`             | `auto`)                                 | Network Scheduler (HTTP/2 / HTTP/3 Streams)                         | *"How much bandwidth and multiplexing priority does this request get?"*          |
| **3. Decoding**    | `decoding` (`async`     | `sync`            | `auto`)                                 | CPU Rasterizer & Image Decoder                                      | *"Do we uncompress the raw bytes on the main thread or on a background thread?"* |
