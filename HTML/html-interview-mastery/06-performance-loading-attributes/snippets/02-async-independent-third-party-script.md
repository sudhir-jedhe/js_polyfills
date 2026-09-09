***  02-async-independent-third-party-script.md ***

# Snippet: `async` for an Independent Analytics Script

```html
<head>
  <script src="app.js" defer></script>
  <script src="https://analytics.example.com/tracker.js" async></script>
</head>
```

`tracker.js` has no relationship to `app.js` and doesn't need to run at any particular point relative to parsing or `app.js` — it just needs to load and fire as soon as possible without slowing anything else down. `async` fetches it in parallel and executes it the instant it's ready, potentially interrupting HTML parsing at whatever point that happens to be, and with no guaranteed ordering relative to `app.js` (which itself won't run until parsing finishes, per `defer`'s rules) — this is fine here specifically because the two scripts don't depend on each other at all.
