**`preconnect`**, **`preload`**, **`prefetch`**, and **`prerender`** are browser optimization directives that tell the browser how to prioritize networking, downloading, and rendering tasks.

---

### Comparison Matrix

| Directive        | Scope        | Action Taken                                                 | Priority   | Primary Use Case                                             |
| ---------------- | ------------ | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| **`preconnect`** | Current page | DNS + TCP + TLS handshake (no download)                      | High       | 3rd-party origins needed soon (APIs, Google Fonts, CDNs)     |
| **`preload`**    | Current page | Downloads critical asset immediately                         | High       | Late-discovered assets (Hero/LCP image, fonts, critical CSS) |
| **`prefetch`**   | Next page    | Downloads asset during browser idle time                     | Lowest     | Resources for the likely next page navigation                |
| **`prerender`**  | Next page    | Downloads **and silently renders** entire page in background | Background | Instant page loads (e.g., search results, checkout steps)    |

---

### 1. `preconnect`

Establishes the early network handshake (DNS lookup, TCP connection, TLS negotiation) to an external domain before an explicit asset request is made.

```html
<!-- Connect early to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://api.mycdn.com">

```

* **Latency savings:** Saves 100–300ms of round-trip time.
* **Best practice:** Limit to 2–4 critical third-party origins to avoid hogging socket connections.

---

### 2. `preload`

Forces the browser to immediately fetch high-priority resources discovered late in the HTML parsing phase (such as a font declared inside CSS or a hero image in a CSS background).

```html
<!-- Preload critical web font -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Preload LCP hero image -->
<link rel="preload" href="/images/banner.webp" as="image">

```

* **Mandatory:** Always supply the **`as="..."`** attribute (`font`, `image`, `script`, `style`) so the browser assigns the correct fetch priority.
* **Caution:** Unused preloaded resources trigger a console warning after ~3 seconds.

---

### 3. `prefetch`

Downloads resources needed for a **subsequent page** into the HTTP cache during idle time.

```html
<!-- Fetch next route chunk while user is on current page -->
<link rel="prefetch" href="/js/dashboard.chunk.js" as="script">

```

* **Behavior:** Lowest priority; will not compete with network bandwidth on the active page.

---

### 4. `prerender`

Fetches the entire target HTML document, resolves all sub-resources (JS, CSS, images), and **fully renders the page in an invisible background tab/process**. When the user clicks the link, page transition is near-instant (0ms).

```html
<!-- Legacy link tag (deprecated in favor of Speculation Rules) -->
<link rel="prerender" href="https://example.com/checkout">

```

#### Modern Replacement: Speculation Rules API

The modern standard replaces `<link rel="prerender">` with the JSON-based **Speculation Rules API**, which supports eagerness controls and click/hover heuristics:

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "where": { "href_matches": "/product/*" },
      "eagerness": "moderate"
    }
  ]
}
</script>

```

* `eagerness: "immediate"`: Prerenders as soon as the rule is parsed.
* `eagerness: "moderate"`: Prerenders when hovering/pointing over the link (200ms delay).
* `eagerness: "conservative"`: Prerenders only on `mousedown` / `pointerdown`.

---

### Pipeline Visual

```text
preconnect : [DNS] ──► [TCP] ──► [TLS]
preload    : [DNS] ──► [TCP] ──► [TLS] ──► [Download NOW] (High priority, Current Page)
prefetch   : [DNS] ──► [TCP] ──► [TLS] ──► [Download on IDLE] (Low priority, Next Page)
prerender  : [DNS] ──► [TCP] ──► [TLS] ──► [Download ALL] ──► [Render DOM & JS in background]

```
