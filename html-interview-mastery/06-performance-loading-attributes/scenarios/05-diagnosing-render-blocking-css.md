# Scenario: Diagnosing an App with a Long First-Paint Delay Caused by CSS

**Scenario:** A dashboard app's Lighthouse report flags "Eliminate render-blocking resources," pointing at a single `styles.css` file that's 400KB (uncompressed) and loaded via a plain `<link rel="stylesheet">` in `<head>`, containing styles for the entire application — login screen, dashboard, settings, admin panel, print styles — even though any single page view only ever uses a fraction of it. First paint is delayed by over a second waiting on this one file. How do you fix it?

**Diagnosis:** CSS is render-blocking by design (the render tree can't be built without the CSSOM), so the browser is correctly withholding first paint until the entire 400KB stylesheet is fetched and parsed — the actual problem is that this single file bundles far more than any given page needs, all of it treated as equally "critical" by the browser even though most of it isn't relevant to the current view.

**Fix 1 — split into a small critical file + a larger deferred-effect file:**

```html
<head>
  <!-- Small: layout shell, typography, above-the-fold dashboard styles only -->
  <link rel="stylesheet" href="/styles/critical.css">

  <!-- Large: everything else, loaded without blocking render via the media-swap trick -->
  <link rel="stylesheet" href="/styles/rest.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/styles/rest.css"></noscript>
</head>
```

`critical.css` blocks render, but it's now small enough (styles for just what's visible immediately) that the block period is short. `rest.css` still loads — the browser fetches it regardless of the `media="print"` trick — but isn't treated as blocking for the current screen rendering context, so first paint doesn't wait on it; `onload` flips `media` back to `'all'` once it's actually available, applying the rest of the styles shortly after.

**Fix 2 — route-based code-splitting (if using a build tool):** Since the app has genuinely distinct views (login, dashboard, settings, admin), a bundler-based per-route CSS split (each route's JS bundle imports only the CSS it needs) avoids shipping login-page or admin-panel styles to a user who's only ever looking at the dashboard — cutting the *total* CSS payload for any single page view, not just deferring some of it.

**Fix 3 — compression:** A 400KB uncompressed file is frequently 60-100KB gzipped/brotli-compressed — confirming the server actually applies compression to CSS responses is a near-zero-effort win that should be checked before anything else, since it directly shrinks the render-blocking transfer size regardless of any other change.

**Why not just add `defer`-like behavior to the `<link>` directly?** `<link>` has no `defer`/`async` equivalent — CSS's blocking behavior is fundamentally different from script blocking (it blocks *rendering*, not *parsing*), which is exactly why the `media="print"` swap trick (or the newer `media="(min-width: 1px)"`-style techniques) exists as a workaround rather than a first-class attribute solving this directly.
