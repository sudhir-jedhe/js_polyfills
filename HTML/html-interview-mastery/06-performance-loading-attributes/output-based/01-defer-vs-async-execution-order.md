*** copy 01-defer-vs-async-execution-order.md ***

# Output: `defer` vs `async` vs Plain — Execution Order

```html
<head>
  <script src="plain.js"></script>
  <script src="deferred.js" defer></script>
  <script src="asynced.js" async></script>
</head>
<body>
  <p>Content</p>
</body>
```

Assume: `plain.js` is tiny and cached (fetches instantly). `deferred.js` takes 200ms to download. `asynced.js` takes 50ms to download (fastest of the three).

**Question:** In what order do the three scripts execute, and how does that relate to `DOMContentLoaded`?

**Answer:**
1. `plain.js` — executes first, immediately, blocking parsing (the parser cannot proceed past it until it's fetched and run, and since it's cached/instant, this happens right away).
2. `asynced.js` — executes next, as soon as its 50ms download finishes, which (since it started downloading in parallel while `plain.js` was blocking) could interrupt HTML parsing at whatever point parsing has reached by then.
3. `deferred.js` — executes last, **not** because it was written after `asynced.js` in some racing sense, but because `defer` scripts are held until parsing fully completes — even though `asynced.js`'s file is larger/slower to write out here, the constraint that matters is that ALL deferred scripts run only after parsing ends, right before `DOMContentLoaded`.
4. `DOMContentLoaded` fires immediately after `deferred.js` finishes executing.

**Why:** Plain scripts block parsing and run in strict document position order, immediately. `async` scripts execute the moment their own fetch completes, with no guaranteed relationship to parsing progress or to other scripts — timing is purely download-speed-dependent. `defer` scripts are deliberately held back until the parser has finished the entire document, and then run in document order, always before `DOMContentLoaded`. The key trap in this exact example: even though `asynced.js` downloads faster (50ms vs 200ms) and is declared *after* `deferred.js` in the HTML, it very likely executes *before* `deferred.js`, because `async` doesn't wait for parsing to finish at all, while `defer` always does.
