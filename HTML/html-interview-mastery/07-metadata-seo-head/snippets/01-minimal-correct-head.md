*** copy 01-minimal-correct-head.md ***

# Snippet: A Minimal, Correctly Ordered `<head>`

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Example Store — Running Shoes</title>
  <meta name="description" content="Shop running shoes for road, trail, and race day. Free shipping over $50.">
  <link rel="canonical" href="https://example.com/products/running-shoes">
  <link rel="icon" href="/favicon.ico">
</head>
```

`charset` is first because encoding must be known before the rest of the document can be reliably parsed. `viewport` comes early since it affects initial rendering on mobile. Everything else follows in no strictly required order, though `title` conventionally comes early since it's used immediately by the browser tab.
