# Output: Plain `<script>` Querying an Element Declared After It

```html
<body>
  <script>
    const el = document.getElementById('title');
    console.log(el);
  </script>
  <h1 id="title">Hello</h1>
</body>
```

**Question:** What gets logged?

**Answer:** `null`.

**Why:** A plain (non-`defer`, non-`async`) `<script>` executes synchronously the instant the parser reaches it — and the parser has not yet reached the `<h1 id="title">` line below it, so that element does not exist in the DOM yet at the moment this script runs. `document.getElementById('title')` searches the DOM as it currently exists, finds nothing matching, and returns `null`. Moving the `<script>` to the bottom of `<body>` (after the `<h1>`), or adding `defer` (which would hold execution until the entire document, including the `<h1>`, has been parsed), would both fix this and return the actual element.
