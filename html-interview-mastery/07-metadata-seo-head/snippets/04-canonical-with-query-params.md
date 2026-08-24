# Snippet: Canonical Tag Consolidating URL Parameter Variants

```html
<!-- Served at: https://example.com/shoes?color=red&sort=price -->
<head>
  <link rel="canonical" href="https://example.com/shoes">
</head>
```

Every combination of `?color=`/`?sort=`/tracking parameters on `/shoes` declares the same canonical — telling search engines "these are all the same underlying page; consolidate ranking signal onto the plain `/shoes` URL," regardless of which specific query-parameter variant a crawler happens to discover or a user happens to land on.
