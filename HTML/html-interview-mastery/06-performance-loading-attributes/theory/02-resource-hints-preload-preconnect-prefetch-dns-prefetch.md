***  02-resource-hints-preload-preconnect-prefetch-dns-prefetch.md ***

# Resource Hints: `preload`, `preconnect`, `prefetch`, `dns-prefetch`

Resource hints are `<link rel="...">` declarations that tell the browser about resources it will need soon, so it can start work (DNS lookup, connection setup, or the actual fetch) earlier than it would discover naturally from parsing. They're all *hints*, not commands — browsers can ignore or deprioritize them under resource pressure.

## The four hints compared

| Hint | What it does | When to use | Priority |
|---|---|---|---|
| `dns-prefetch` | Resolves a domain's DNS early, nothing more | You know you'll load resources from a third-party domain (fonts CDN, analytics, ad network) later on the page | Very low cost, very low priority |
| `preconnect` | Does DNS + TCP handshake + TLS negotiation early (the full connection setup, minus the actual request) | Same as `dns-prefetch` but for connections you're **confident** you'll use very soon — it's more expensive to hold open, so don't scatter it on every third-party domain | Low, but higher cost than `dns-prefetch` |
| `preload` | Fetches a **specific, known-critical** resource immediately, at high priority, for use **on this page load** | A font used in above-the-fold text, a hero image, a critical CSS/JS file the browser wouldn't otherwise discover early | High — competes with other critical resources |
| `prefetch` | Fetches a resource at **low priority**, for a **likely future navigation** (not this page) | A resource needed on the *next* page the user is likely to visit (e.g., prefetch the next paginated article) | Low — only uses idle bandwidth |

## `dns-prefetch`

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

Cheapest possible hint — just resolves the domain name ahead of time so the actual connection (when it happens) skips the DNS lookup round trip. Good default for any third-party domain you know you'll hit.

## `preconnect`

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

Performs DNS + TCP + TLS handshake ahead of time — meaningfully shaves latency off the *first* request to that origin (particularly valuable for HTTPS, where the TLS handshake itself costs a round trip or more). Because keeping a connection open has a real cost, `preconnect` should be used sparingly — typically no more than a handful of critical third-party origins, not every domain referenced on the page. The `crossorigin` attribute is required when preconnecting to a origin that will be fetched with CORS (e.g., fonts), otherwise the browser opens a connection that can't actually be reused for the credentialed/CORS request.

## `preload`

```html
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero.jpg" as="image">
```

Tells the browser "fetch this now, at high priority — I know for certain I need it for this page." The `as` attribute is required and must match the resource type (`font`, `style`, `script`, `image`, etc.) so the browser applies the correct request priority and, crucially, so it can match the preloaded resource to the actual later usage (a mismatched or missing `as` causes the browser to fetch the resource **twice**). Fonts also require `crossorigin` even for same-origin requests, due to how the Fetch spec handles font requests.

**Common mistake:** overusing `preload` on many resources dilutes its benefit — since it's *high priority*, preloading too much competes with the actually-critical resources for bandwidth and can make things slower overall, not faster. It's meant for the small handful of resources the browser wouldn't otherwise discover early enough on its own (e.g., a font referenced only inside CSS, which the browser can't know about until it's parsed the CSS — by which point it may be "too late" for a good First Contentful Paint).

## `prefetch`

```html
<link rel="prefetch" href="/next-article.html">
```

Low-priority fetch for a resource likely needed on a **future** navigation, not the current page. Since it competes only for idle bandwidth, it won't slow down the current page's own critical resources — but it also means there's no guarantee it finishes before the user actually navigates there.

## Choosing between them — quick guide

- Know you'll connect to a third-party domain, but not fetching anything specific yet → `dns-prefetch` (or `preconnect` if the connection is imminent and important).
- Know you need a *specific* resource for the *current* page, and the browser wouldn't discover it early enough on its own → `preload`.
- Predicting a resource needed for the *next* page/navigation → `prefetch`.
- Don't preload/preconnect everything — hints have a real, if small, cost, and over-hinting can crowd out genuinely critical resources.
