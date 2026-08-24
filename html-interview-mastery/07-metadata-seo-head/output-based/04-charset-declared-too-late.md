# Output: `charset` Declared After a Large Inline `<style>` Block

```html
<head>
  <style>
    /* imagine ~2000 bytes of CSS comments and rules here, pushing charset below
       the first 1024 bytes of the document */
  </style>
  <meta charset="UTF-8">
  <title>Café Menu — Ünïcode Test</title>
</head>
```

**Question:** Is this a valid, safe way to declare the document's character encoding?

**Answer:** No — this risks the browser misinterpreting non-ASCII characters (like "Café" and "Ünïcode" in the title, or anywhere else in the document) before it even reaches the `charset` declaration.

**Why:** The HTML spec requires `<meta charset>` to appear within the **first 1024 bytes** of the document specifically because the browser must know the encoding before it can correctly parse everything that follows — if enough preceding bytes (here, the large inline `<style>` block) push the declaration past that threshold, the browser may have already begun parsing under a guessed or default encoding, potentially misinterpreting earlier non-ASCII bytes as the wrong characters (mojibake). The fix is simply to make `<meta charset="UTF-8">` the very first element inside `<head>`, before any other content, style blocks, or comments of meaningful size.
