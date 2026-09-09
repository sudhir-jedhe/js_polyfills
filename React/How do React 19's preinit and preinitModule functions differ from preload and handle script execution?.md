***  How do React 19's preinit and preinitModule functions differ from preload and handle script execution?.md ***

While `preload` and `preloadModule` only **download and cache** resources ahead of time without executing them, **`preinit`** and **`preinitModule`** go one step further: they **fetch AND immediately initialize/execute** the resource (inserting it as an active `<script>` or `<link rel="stylesheet">` in the document).

Both functions are exported directly from `react-dom`.

---

**The Core Difference: `preload` vs. `preinit**`

| API                             | Browser Action                                   | Emitted HTML Tag                                                         | Execution Behavior                                                                                           |
| ------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **`preload` / `preloadModule**` | **Fetch only** (caches resource in memory/disk). | `<link rel="preload">` or `<link rel="modulepreload">`                   | **Does NOT execute**. The script or stylesheet sits idle until a component explicitly imports or renders it. |
| **`preinit` / `preinitModule**` | **Fetch and execute** as soon as downloaded.     | `<script async src="...">` or `<link rel="stylesheet" precedence="...">` | **Executes immediately**. Initializes global scripts or applies stylesheets to the page right away.          |

---

**1. `preinit(href, options)`: Classic Scripts & Stylesheets**

Used to load and immediately run a standard JavaScript file or apply an active stylesheet.

* **Signature:** `preinit(href, { as: 'script' | 'style', precedence?, crossOrigin?, integrity?, nonce?, fetchPriority? })`

```tsx
import { preinit } from 'react-dom';

export function MapWidget({ apiKey }: { apiKey: string }) {
  // Fetches and immediately executes the Google Maps SDK script
  preinit(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`, {
    as: 'script',
    fetchPriority: 'high',
  });

  // Fetches and applies the widget stylesheet with precedence ordering
  preinit('/styles/map-widget.css', {
    as: 'style',
    precedence: 'medium',
  });

  return <div id="map-container">Map is loading...</div>;
}

```

* **HTML emitted to `<head>`:**

```html
<script async src="https://maps.googleapis.com/maps/api/js?key=..."></script>
<link rel="stylesheet" href="/styles/map-widget.css" data-precedence="medium">

```

---

**2. `preinitModule(href, options)`: ES Modules**

Used to download, evaluate, and execute an ES Module script directly.

* **Signature:** `preinitModule(href, { as?: 'script', crossOrigin?, integrity?, nonce? })`

```tsx
import { preinitModule } from 'react-dom';

export function AnalyticsTracker() {
  // Downloads and evaluates the module script immediately
  preinitModule('/modules/telemetry.mjs', {
    as: 'script',
    crossOrigin: 'anonymous',
  });

  return null;
}

```

* **HTML emitted to `<head>`:**

```html
<script type="module" async src="/modules/telemetry.mjs" crossorigin="anonymous"></script>

```

---

**How Script Execution is Handled Under the Hood**

1. **Always Asynchronous (`async`):**
When `preinit` loads a script, React always injects it as an `async` script tag. It will never block HTML parsing or initial client-side hydration.
2. **Deduplication:**
If multiple instances of a component call `preinit('[https://cdn.com/sdk.js](https://cdn.com/sdk.js)', { as: 'script' })`, React ensures that only a single `<script>` element is inserted into `<head>` and executed once.
3. **Precedence Integration for Styles:**
When using `preinit(..., { as: 'style', precedence: 'high' })`, React inserts the stylesheet according to its cascade order and integrates with `<Suspense>`, pausing surrounding UI until the stylesheet finishes loading.

---

**Decision Guide: Which API Should You Use?**

```
Do you want to run/apply the resource immediately?
   │
   ├── YES ──▶ Is it an ES Module?
   │              ├── YES ──▶ `preinitModule(href, options)`
   │              └── NO  ──▶ `preinit(href, { as: 'script' | 'style' })`
   │
   └── NO (Speculative / Cache Only) ──▶ Is it an ES Module chunk?
                  ├── YES ──▶ `preloadModule(href, options)`
                  └── NO  ──▶ `preload(href, { as: 'font' | 'image' | 'script' | 'style' })`

```
