*** copy 01-slow-marketing-page-time-to-interactive.md ***

# Scenario: Marketing Page With a High "Time to Interactive"

**Scenario:** A marketing landing page scores poorly on Lighthouse for Time to Interactive and First Contentful Paint. Looking at the `<head>`, you find: a 200KB unminified CSS framework loaded via `<link>`, three third-party `<script>` tags (chat widget, A/B testing tool, analytics) with no loading attributes, and the site's own small `app.js`, also with no attributes — all five resources declared before any page content in `<body>`. How do you diagnose and fix this?

**Diagnosis:** Every one of the five resources is currently render-blocking or parse-blocking in the worst possible way: the CSS delays first paint until it's fully fetched and parsed (unavoidable to some degree for CSS, but 200KB unminified is avoidable bloat), and all four `<script>` tags — three of them third-party, unrelated to the page's own rendering — are plain blocking scripts, meaning HTML parsing (and therefore the DOM, and therefore anything that could be painted) is paused four separate times before the browser even finishes building the page structure.

**Fix, piece by piece:**

```html
<head>
  <!-- 1. Minify/compress the CSS framework, and confirm it's actually all needed —
          200KB unminified is often 30-50KB minified+gzipped, or far less if unused
          framework classes are purged. -->
  <link rel="stylesheet" href="/styles/framework.min.css">

  <!-- 2. Own app script: defer — no longer blocks parsing, still guaranteed to run
          before DOMContentLoaded with the DOM fully available. -->
  <script src="/app.js" defer></script>

  <!-- 3. Third-party scripts with no relationship to page rendering: async —
          they load and fire independently, without blocking parsing OR waiting on
          each other or on app.js. -->
  <script src="https://chat-widget.example.com/widget.js" async></script>
  <script src="https://ab-test.example.com/experiment.js" async></script>
  <script src="https://analytics.example.com/tracker.js" async></script>
</head>
```

**Why this specific split (defer for app.js, async for the third-party scripts):** `app.js` likely queries/manipulates the page's own DOM (form handlers, animations tied to specific elements), so it needs the guarantee that parsing has finished and needs predictable execution — `defer` provides both. The three third-party scripts don't share any dependency with `app.js` or with each other; each one just needs to eventually load and initialize itself, so there's no reason to force any ordering or to block parsing for any of them — `async` is strictly better here, letting each one load exactly as fast as its own network conditions allow.

**Result:** HTML parsing (and therefore DOM construction and, once CSSOM is ready, first paint) is no longer gated behind four sequential script executions — it proceeds immediately, while all four scripts fetch in parallel in the background, each executing independently once ready.
