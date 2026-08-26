*** copy Explain the HTML Speculation Rules API and how it enables instant prerendering and prefetching.md ***

The **Speculation Rules API** is a web standard designed to provide near-instant page navigations. It replaces legacy `<link rel="prefetch">` and deprecated prerendering implementations with a structured, declarative JSON configuration.

Instead of imperatively injecting DOM tags, you define rules inside a `<script type="speculationrules">` block (or via the `Speculation-Rules` HTTP header).

---

### Core Concept: Prefetch vs. Prerender

The API supports two distinct speculative actions:

* **`prefetch` (HTML Only):** Downloads the next page's main HTML document in the background and places it in an in-memory cache. Subresources (CSS, JS, images) are not fetched, and JavaScript is not executed.
* **`prerender` (Full Page + Subresources + JS):** Fetches the HTML, downloads all critical subresources, builds the DOM/CSSOM, and executes JavaScript in an invisible, isolated background tab. When the user clicks the link, the browser simply swaps the invisible tab into view, achieving **0ms perceived load time** (instant navigation).

---

### Basic Syntax & Rule Types

Speculation rules can target specific URLs (list rules) or dynamically match links on the page (document rules).

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "source": "list",
      "urls": ["/dashboard", "/checkout"]
    }
  ],
  "prefetch": [
    {
      "source": "document",
      "where": {
        "and": [
          { "href_matches": "/*" },
          { "not": { "href_matches": "/logout" } },
          { "not": { "selector_matches": ".no-speculation" } }
        ]
      },
      "eagerness": "moderate"
    }
  ]
}
</script>

```

---

### Eagerness Levels (When Speculation Happens)

The `eagerness` property controls the exact trigger conditions for matching links:

| Eagerness          | Trigger Condition                                                           | Best Used For                                       |
| ------------------ | --------------------------------------------------------------------------- | --------------------------------------------------- |
| **`immediate`**    | Triggers immediately when the rule is parsed (regardless of user action).   | High-confidence next steps (e.g., checkout step 2). |
| **`eager`**        | Same as `immediate`.                                                        | High-confidence navigations.                        |
| **`moderate`**     | Triggers on **hover for ~200ms** or `pointerdown`.                          | General navigation links, main menus.               |
| **`conservative`** | Triggers only on **`pointerdown` / mousedown** (just before mouseup/click). | Low-risk bandwidth conservation.                    |

---

### Key Advantages Over Legacy `<link rel="prefetch">`

1. **Document-Level Matching:** You don't need JavaScript event listeners or hover handlers on every `<a>` tag; the browser automatically matches URLs using URL Pattern API syntax (`href_matches`) and CSS selectors (`selector_matches`).
2. **True Full-Page Prerendering:** Legacy `<link rel="prefetch">` only caches static assets; `prerender` executes the page layout and JS beforehand.
3. **Browser Resource Awareness:** The browser automatically pauses or drops speculation if the user has **Data Saver** enabled, is on **Battery Saver**, or when device memory/CPU is constrained.
4. **Safety Defaults:** Restricted operations like `alert()`, `confirm()`, microphone/camera prompts, or autoplaying video are automatically suppressed while a page is in the prerendering state.

---

### Detecting Prerender State in JavaScript

You can detect whether your page is currently rendering in the background and delay analytics or side-effects until the user actually activates it:

```javascript
if (document.prerendering) {
  // Page is running in the background; wait for activation
  document.addEventListener('prerenderingchange', () => {
    console.log('Page activated! Send analytics pageview now.');
  }, { once: true });
} else {
  // Page loaded normally
  console.log('Regular page load.');
}

```
