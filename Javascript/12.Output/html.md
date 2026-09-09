### 1. What does a doctype do?

A **Document Type Declaration** (`<!DOCTYPE>`) informs the browser's HTML parser which specification of HTML or XHTML the document conforms to.

* **Rendering Modes:** Its primary purpose in modern browsers is **Doctype Switching**. If a valid doctype like `<!DOCTYPE html>` (HTML5) is present, the browser operates in **Standards Mode** (full adherence to W3C/WHATWG specifications). Without it (or with an outdated doctype), the browser falls back into **Quirks Mode** or **Almost Standards Mode**, emulating legacy behavior (such as the legacy IE box model where padding and borders were included within `width`, and altered layout behaviors for tables and images).
* **Case Sensitivity & Syntax:** In HTML5, `<!DOCTYPE html>` is case-insensitive, does not require a DTD (Document Type Definition) URI, and acts purely as a trigger for modern standards rendering.

---

### 2. How do you serve a page with content in multiple languages?

* **URL Architecture:**
* **ccTLDs:** `example.de`, `example.fr` (strongest local geo-targeting, expensive to manage).
* **Subdomains:** `de.example.com`, `fr.example.com` (easy DNS separation, can host across different regions).
* **Subdirectories:** `[example.com/de/](https://example.com/de/)`, `[example.com/fr/](https://example.com/fr/)` (consolidates domain authority/SEO; easiest to maintain).
* *Avoid query parameters* (e.g., `?lang=es`) where possible for primary indexable content.

* **HTML Declaration:** Set the root `<html lang="xx-YY">` attribute with BCP 47 language codes (e.g., `lang="en-US"`, `lang="zh-Hans"`). Set `dir="rtl"` when applicable (Arabic, Hebrew, Persian).
* **SEO Metadata:** Implement bidirectional `<link rel="alternate" hreflang="x" href="...">` elements in the `<head>` (or XML sitemap) for every localized version, including `hreflang="x-default"` for unlocalized fallback fallthroughs.
* **HTTP Headers:**
* Respond with `Content-Language: xx` in the HTTP response headers.
* Evaluate the incoming `Accept-Language` header for automated routing or geo-suggestion banners (prefer soft redirects or user-choice banners over hard automated 302 redirects to avoid breaking web crawlers).

* **Content Negotiation vs. Explicit Routing:** Rely on explicit URLs (subdirectories/subdomains) for indexed pages rather than dynamic server negotiation on a single URL, ensuring search engines can crawl each localized version independently.

---

### 3. Considerations when designing or developing for multilingual sites

* **Text Expansion and Contraction:**
* Languages like German, Russian, or French often expand by 20% to 40% compared to English, while East Asian languages (CJK) contract horizontally.
* Avoid fixed container widths (`px`) or hard line breaks. Use dynamic layouts (CSS Flexbox/Grid) with responsive wrappers.

* **Bi-directional Layouts (RTL):**
* Scripts like Arabic and Hebrew require page layout flipping (scrollbars, form inputs, breadcrumbs, directional icons).
* Use **CSS Logical Properties** instead of physical ones: `margin-inline-start`, `padding-inline-end`, `inset-inline`, and `border-inline-start` instead of `left` and `right`.

* **Typography and Character Encodings:**
* Always enforce `<meta charset="UTF-8">`.
* Ensure system or web fonts cover extended glyphs, diacritics, and complex scripts without falling back to mismatched system fonts ("FOUT" or "tofu" missing glyph blocks `▯`). Adjust `line-height` for scripts requiring taller ascenders/descenders (e.g., Arabic, Thai, Devanagari).

* **Date, Time, Currency, and Number Formatting:**
* Dates: `MM/DD/YYYY` (US) vs. `DD/MM/YYYY` (UK/Europe) vs. `YYYY-MM-DD` (ISO).
* Decimal and thousands separators swap across locales (e.g., `1,234.56` in US vs. `1.234,56` in Germany). Use the native browser `Intl` API (`Intl.DateTimeFormat`, `Intl.NumberFormat`) for client-side formatting.

* **Form Inputs and Data Handling:**
* Avoid overly strict validations on first/last name fields (some cultures use a single name, patronymics, or have family names first).
* Accommodate variable phone number formats, postal code lengths, and non-ASCII character inputs in backend databases (UTF-8 collation / `utf8mb4`).

---

### 4. What are `data-` attributes good for?

`data-*` attributes provide a standardized way to embed custom, non-visible metadata directly into standard HTML elements without violating HTML specifications or abusing classes.

* **DOM-to-Script Communication:** Passing static configuration, entity identifiers (e.g., `data-user-id="4812"`), or state hooks from server-rendered HTML to JavaScript.
* **API Access via `dataset`:**
* HTML: `<button data-action-type="save" data-item-id="98">`
* JS: `element.dataset.actionType` (automatically converts hyphenated names to camelCase).

* **CSS Styling and Pseudo-elements:**
* Attribute selectors: `[data-status="active"] { border-color: green; }`
* Generated content: `div::after { content: attr(data-tooltip); }`

* **Anti-patterns / Caveats:**
* **Not for sensitive data:** They are fully visible in the DOM/source inspect.
* **Not accessible to screen readers:** Accessibility tools generally ignore `data-*`; use proper `aria-*` attributes for assistive tech state instead.
* **Performance overhead:** Heavy reads/writes to `dataset` trigger DOM operations and reflows/repaints if tied to style selectors.

---

### 5. HTML5 as an Open Web Platform: Building blocks

HTML5 expanded HTML from a document-markup specification into a full runtime application platform:

* **Semantics & Structure:** Tags conveying structural meaning: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<main>`, and form input types (`type="email"`, `type="date"`, `<output>`).
* **Rich Embedded Media:** Native audio and video support without third-party plugins (Flash/Silverlight) via `<video>` and `<audio>`, paired with Web Audio APIs and MSE (Media Source Extensions).
* **Programmable Graphics & Visuals:** Dynamic pixel rastering with `<canvas>` (2D & WebGL), vector integration with inline `<svg>`, and WebGPU.
* **Offline Storage & Caching:** `localStorage`, `sessionStorage`, `IndexedDB`, the File and Blob APIs, and Service Workers / Cache API.
* **Connectivity & Real-Time Communication:** WebSockets, Server-Sent Events (`EventSource`), and WebRTC for peer-to-peer audio/video/data transfer.
* **System & Device Access:** Geolocation API, Web Notifications, Web Sensors, Vibration API, Web Bluetooth, and Screen Wake Lock.
* **Multi-threading & Performance:** Web Workers (background CPU offloading), SharedArrayBuffer, and WebAssembly (Wasm) runtime integration.

---

### 6. Differences: `cookie` vs. `sessionStorage` vs. `localStorage`

| Feature             | `cookie`                                                                       | `sessionStorage`                                                           | `localStorage`                                                      |
| ------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Capacity**        | ~4 KB per domain                                                               | ~5 MB to 10 MB                                                             | ~5 MB to 10 MB                                                      |
| **Lifecycle**       | Set via `Expires` or `Max-Age`. Defaults to browser session closure.           | Cleared when the specific browser tab or window closes.                    | Persists indefinitely until explicitly cleared by user or script.   |
| **Server Transfer** | Sent automatically with **every** HTTP request via the `Cookie` header.        | Client-side only; never sent over HTTP requests.                           | Client-side only; never sent over HTTP requests.                    |
| **Scope / Access**  | Accessible across tabs, windows, and subdomains (if configured).               | Scoped strictly to the origin **and** the specific individual browser tab. | Scoped to the origin across all tabs and windows.                   |
| **Security Flags**  | Supports `HttpOnly` (blocks JS access/XSS), `Secure` (HTTPS only), `SameSite`. | Accessible by any script running on the origin (vulnerable to XSS).        | Accessible by any script running on the origin (vulnerable to XSS). |
| **API**             | Clunky document string: `document.cookie`.                                     | Storage API: `getItem()`, `setItem()`, `removeItem()`.                     | Storage API: `getItem()`, `setItem()`, `removeItem()`.              |

---

### 7. Differences: `<script>`, `<script async>`, and `<script defer>`

```
Parsing HTML:     =======[  Blocked  ]===========>
<script>:                [ Fetch + Run ]

Parsing HTML:     ====================[ Blocked ]=>
<script async>:          [ Fetch ]    [ Run ]

Parsing HTML:     ================================> (DOMContentLoaded)
<script defer>:          [ Fetch ]                 [ Run ]

```

* **Standard `<script>`:**
* HTML parsing **stops immediately** when the parser hits the tag.
* The browser fetches the file over the network and executes it synchronously before resuming parsing. Blocks initial DOM construction.

* **`<script async>`:**
* The script is fetched in the background **asynchronously** without pausing HTML parsing.
* **Critical:** Once downloaded, HTML parsing pauses immediately so the script can execute.
* **Execution Order:** Independent of document order. Whichever script downloads first executes first. Best for independent third-party utilities (e.g., analytics, telemetry).

* **`<script defer>`:**
* The script is fetched asynchronously in parallel with HTML parsing.
* Execution is deferred until the HTML parser finishes constructing the DOM tree (just before the `DOMContentLoaded` event fires).
* **Execution Order:** Guaranteed to preserve document order relative to other `defer` scripts. Best for application bundle scripts that depend on DOM nodes or on one another.

---

### 8. Placement: CSS `<link>` in `<head>` and JS `<script>` before `</body>`

* **Why CSS in `<head>`:**
* Browsers must construct the **CSSOM** (CSS Object Model) before calculating layout and rendering pixels.
* Placing `<link rel="stylesheet">` in the `<head>` allows styles to begin downloading immediately.
* If placed at the bottom, the browser renders unstyled HTML, then restyles it once CSS loads, causing **FOUC (Flash of Unstyled Content)** and significant layout shifts.

* **Why JS before `</body>`:**
* Traditional scripts block HTML parsing. Placing them at the very end ensures the entire DOM tree is parsed and painted before the browser incurs the network and execution cost of JavaScript.

* **Modern Exceptions:**
* **Modern Script Attributes (`defer`/`async`):** With `defer` or ES modules (`<script type="module">`, which defaults to deferred execution), `<script>` tags can be safely placed in the `<head>`—they fetch in parallel without blocking parsing.
* **Critical Rendering Path / Critical CSS:** Inlining critical CSS directly into a `<head>` `<style>` block and deferring non-critical stylesheets via asynchronous loading (`media="print"` hack or preload).
* **Pre-render Runtime Bootstrapping:** Scripts that prevent theme flashing (reading user dark/light mode preference from storage to apply classes to `<html>`) must execute synchronously inside `<head>` to prevent a Flash of White/Wrong Theme.

---

### 9. What is progressive rendering?

**Progressive rendering** refers to a suite of techniques used to display web content to users incrementally as it is downloaded and processed, minimizing perceived load time and avoiding blank screens.

Key techniques include:

* **HTTP/1.1 Chunked Transfer Encoding & Streaming HTML:** The server flushes early chunks of the HTML (such as the document `<head>` and shell) while database queries or APIs finish processing the rest of the body.
* **Lazy Loading Media:** Deferring off-screen images and iframes using native `loading="lazy"` or `IntersectionObserver` until the user scrolls near them.
* **Skeleton Screens:** Displaying wireframe placeholder shapes while asynchronous data fetches complete, reducing visual jarring.
* **CSS `content-visibility: auto`:** Instructs the layout engine to skip rendering off-screen DOM subtrees until they approach the viewport.
* **Progressive JPEG/WebP Images:** Encoding image files so they display an initial low-resolution blur across the full container, progressively refining in passes as data arrives.

---

### 10. The `srcset` attribute & how the browser evaluates it

The `srcset` attribute provides a set of image candidate resources alongside condition descriptors (width `w` or pixel density `x`), enabling **responsive images** tailored to screen dimensions and DPR (Device Pixel Ratio).

```html
<img src="fallback.jpg"
     srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="Responsive illustration">

```

#### Evaluation Process

1. **Viewport & Device Interrogation:** The browser inspects current device constraints: screen viewport width and hardware DPR (e.g., 2x on Retina displays).
2. **`sizes` Resolution:** The browser parses the `sizes` attribute against its current viewport queries to determine the **intended display slot width** (e.g., at a 500px viewport, `(max-width: 600px)` matches, resolving slot size to `100vw` = 500px).
3. **Target Pixel Calculation:** The browser multiplies slot width by device pixel ratio:

$$\text{Required Pixels} = \text{Slot Width} \times \text{DPR}$$

*(Example: $500\text{px} \times 2 = 1000\text{px}$)*.
4. **Candidate Selection:** The browser selects the candidate from `srcset` whose width descriptor matches or is just larger than the computed target (in this scenario, picking `large.jpg 1200w`).
5. **Bandwidth & Cache Adjustment:** Modern engines factor in network connection data (`navigator.connection.effectiveType`) or existing cached higher-res images, opting to use the cache or downscale if data-saver mode is active.

---

### 11. HTML Templating Languages

HTML templating languages abstract markup generation by introducing logic (loops, conditionals, partials, data interpolation) that compiles down to raw HTML strings or virtual DOM structures.

* **Server-Side Compiled (String-based):**
* **EJS / ERB / Jinja2 / Blade:** Embeds control flow directly into HTML tags (`<% if (user) { %> <h1><%= user.name %></h1> <% } %>`). Useful for traditional MVC backends.
* **Handlebars / Mustache:** Logic-less syntax enforcing strict separation of presentation and business logic via double curly braces (`{{#each items}}<li>{{name}}</li>{{/each}}`).
* **Pug (formerly Jade):** Whitespace-sensitive, indentation-based shorthand without closing tags, compiling to strict HTML.

* **Component-Based / Client & SSR Runtimes:**
* **JSX / TSX (React):** A syntax extension to JavaScript that translates markup directly into JavaScript function calls (`React.createElement` or modern JSX runtime objects) enabling rich runtime optimization and static type checks.
* **Vue Templates & Svelte:** Single-file templates compiling HTML templates into highly optimized imperative JavaScript DOM updates with fine-grained reactivity.

---

### 12. Difference: `<canvas>` vs. `<svg>`

| Dimension               | `<canvas>`                                                                                                            | `<svg>`                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Technology**          | **Raster/Bitmap** immediate mode rendering.                                                                           | **Vector-based** retained mode rendering.                                                                             |
| **DOM Integration**     | Single DOM element (`<canvas>`). Drawn pixels do not exist in the DOM tree.                                           | Full XML tree inside the DOM. Every shape (`<rect>`, `<circle>`, `<path>`) is a distinct DOM node.                    |
| **Scalability**         | Resolution-dependent. Blurs or pixelates when scaled up unless manually redrawn to canvas dimensions.                 | Infinitely scalable without quality loss; coordinates are resolution-independent.                                     |
| **Event Handling**      | No native event binding to individual drawn shapes. Interaction requires manual hit-testing via $(x, y)$ coordinates. | Standard DOM event listeners can be attached directly to individual shapes (`circle.addEventListener('click', ...)`). |
| **Performance Profile** | Excellent for very high object counts ($>10^4$ particles, physics simulations, 3D/WebGL games).                       | Degrades with high node counts due to DOM tree overhead; best for complex UI elements, icons, maps, charts.           |
| **CSS Integration**     | Cannot be styled with external CSS rules (must be painted via JS context).                                            | Fully stylable using CSS properties (`fill`, `stroke`, hover transitions).                                            |

---

### 13. What are empty elements in HTML?

**Empty elements** (also referred to as **void elements**) are elements in the HTML specification that **cannot have child nodes** (neither text nor nested elements) and **must not have an end tag**.

* **List of Standard Void Elements:**
* `<area>`, `<base>`, `<br>`, `<col>`, `<embed>`, `<hr>`, `<img>`, `<input>`, `<link>`, `<meta>`, `<param>`, `<source>`, `<track>`, `<wbr>`.

* **Syntax Rules:**
* In HTML5, writing a closing tag (e.g., `<img></img>` or `<br></br>`) is invalid syntax.
* The trailing slash (e.g., `<br />`, `<img />`) is syntactically permitted in HTML5 as syntactic sugar to ease migration from XHTML, but the parser internally ignores it.

* **Void vs. Empty Non-Void:**
* An empty element is structurally forbidden from having content (`<hr>` or `<input>`).
* A regular element that happens to contain no text or children (e.g., `<div id="app"></div>` or `<script src="app.js"></script>`) is **not** a void element and **requires** an explicit closing tag. Self-closing non-void tags (`<div />` or `<script />`) break DOM tree parsing in HTML5.
