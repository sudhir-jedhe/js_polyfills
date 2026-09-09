***  01-defer-basic-usage.md ***

# Snippet: `defer` for Application Scripts

```html
<!DOCTYPE html>
<html>
<head>
  <script src="utils.js" defer></script>
  <script src="app.js" defer></script>
</head>
<body>
  <h1 id="title">Loading…</h1>
</body>
</html>
```

```js
// utils.js
function setTitle(text) {
  document.getElementById('title').textContent = text; // safe: full DOM exists by the time defer runs
}
```

```js
// app.js
setTitle('Ready!'); // safe: utils.js already ran, in document order, before this
```

Both scripts are fetched in parallel with HTML parsing (no parser-blocking), then execute in the exact order they appear in the document — `utils.js` before `app.js` — after parsing finishes and before `DOMContentLoaded` fires. `document.getElementById('title')` is guaranteed to find the element even though the scripts are declared in `<head>`, above the `<h1>` in source order, because execution is deferred until parsing (and thus the whole DOM) is complete.
