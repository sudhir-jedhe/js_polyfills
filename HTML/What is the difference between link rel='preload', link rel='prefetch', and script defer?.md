*** copy What is the difference between link rel='preload', link rel='prefetch', and script defer?.md ***

The main difference comes down to **intent** and **lifecycle scope**: `<link rel="preload">` is for critical resources needed for the **current** page immediately; `<link rel="prefetch">` is for speculative resources needed for the **next** navigation; and `<script defer>` is an execution directive for JavaScript on the **current** page.

---

### Comparison Matrix

| Directive                   | Scope / Target                        | What It Does                                                                          | Execution / Parsing                                                                    | Network Priority  | Best Used For                                                                                       |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| **`<link rel="preload">`**  | **Current page** (mandatory & urgent) | Forces early download of a critical resource before the parser naturally discovers it | **Does not execute**; stores raw bytes in the HTTP memory/disk cache                   | **High**          | Late-discovered critical assets (Hero web fonts in CSS, LCP background images, critical CSS chunks) |
| **`<link rel="prefetch">`** | **Future navigation** (speculative)   | Downloads assets in the background during idle time for subsequent pages              | **Does not execute**; persists response in HTTP disk cache for future navigations      | **Lowest / Idle** | Next probable route bundles, next page images, product detail chunks when hovering on a link        |
| **`<script defer>`**        | **Current page** (application logic)  | Downloads script in the background without blocking the HTML parser                   | **Executes automatically** after DOM parsing finishes, right before `DOMContentLoaded` | **Medium / High** | Main application JavaScript bundles, UI frameworks, scripts needing the DOM                         |

---

### 1. `<link rel="preload">` (Current Page Accelerator)

In standard rendering, the browser discovers resources sequentially. For instance, it downloads HTML → finds CSS → parses CSS → finally discovers a web font file declared inside `@font-face`.

`preload` informs the browser's preload scanner about hidden, high-priority resources so they download in parallel with HTML/CSS parsing.

```html
<!-- Requires the 'as' attribute to assign correct network priority and HTTP headers -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="/images/hero-banner.webp" as="image" />

```

* **Important:** If you preload an asset but do not use it within 3 seconds of page load, Chrome logs a console warning: *"The resource was preloaded using link preload but not used within a few seconds"*.
* **Always include `as="..."`:** Omitting `as` causes double fetches because the browser cannot match the resource type to its request context.

---

### 2. `<link rel="prefetch">` (Next Navigation Pre-cacher)

`prefetch` is a low-priority resource hint. The browser waits until the current page has finished its critical rendering path and the network/CPU is idle, then requests the specified asset.

```html
<!-- Prefetch the bundle for the next probable page (e.g. /checkout) -->
<link rel="prefetch" href="/js/checkout-chunk.js" as="script" />

```

* **Non-Blocking:** If the user interacts with the page and triggers higher-priority traffic, the browser slows down or pauses the prefetch.
* **Persistent:** The fetched resource is cached in the browser's HTTP disk cache so that when the user clicks the checkout link, the next page loads instantly.

---

### 3. `<script defer>` (Current Page Script Execution)

Unlike `preload` and `prefetch` (which only *download* and *cache* bytes without evaluating them), `defer` is an execution instruction specifically for `<script>` tags.

```html
<!-- Fetches in parallel; executes automatically in DOM order right before DOMContentLoaded -->
<script src="/js/app.js" defer></script>

```

* **Downloads:** Immediately and in parallel with HTML parsing.
* **Executes:** Automatically in the exact order declared, immediately after HTML parsing completes.

---

### Summary Checklist: When to Use Which

* Use **`preload`** if an asset is needed **on the current screen right now**, but is hidden inside external files (e.g., custom web fonts, CSS background images).
* Use **`prefetch`** if an asset is needed **on the next page the user is likely to visit**.
* Use **`defer`** for your **standard JavaScript application scripts** that depend on a fully constructed DOM tree.
