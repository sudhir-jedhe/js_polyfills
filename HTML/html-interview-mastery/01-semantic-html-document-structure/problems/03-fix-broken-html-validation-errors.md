*** copy 03-fix-broken-html-validation-errors.md ***

# Problem: Fix All HTML Validation Errors

## Problem Statement

The following markup renders "fine" visually but fails HTML validation with multiple errors. Find and fix every issue.

```html
<html>
<head>
<title>Products</title>
<head>
<body>
  <div id="main">
    <div id="main">
      <h1>Our Products</h2>
      <p>Browse our catalog.
        <div class="promo">Free shipping today!</div>
      </p>
      <img src="banner.jpg">
      <ul>
        <div><li>Widget A</li></div>
        <li>Widget B</li>
      </ul>
      <a href="/cart" />View Cart</a>
    </div>
  </div>
</body>
</html>
```

## Constraints

- List every distinct error before fixing it.
- The fixed version must pass W3C validation conceptually (correct nesting, matching tags, unique IDs, required attributes, no obsolete self-closing on non-void elements).

## Solution

**Errors found:**
1. Missing `<!DOCTYPE html>`.
2. Missing `lang` attribute on `<html>`.
3. Missing `<meta charset>`.
4. `<head>` opened twice, never properly closed (`<head>` appears where `</head>` should be).
5. Duplicate `id="main"` used on two different elements — IDs must be unique per document.
6. Mismatched heading tags: `<h1>` opened, `</h2>` closed.
7. A `<div>` (block-level) nested inside a `<p>` — invalid content model, forces an early `</p>` close.
8. `<img>` missing required `alt` attribute.
9. A `<div>` wrapping a single `<li>` inside a `<ul>` — `<ul>`'s content model only permits `<li>` (and a few script-supporting elements) as direct children, not `<div>`.
10. `<a href="/cart" />` — self-closing a non-void element; `<a>` requires an explicit `</a>`, and as written the "self-close" is ignored, making the visible text "View Cart" and its later `</a>` a dangling close tag with unpredictable scope.

**Fixed markup:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Products</title>
</head>
<body>
  <div id="main-outer">
    <div id="main-inner">
      <h1>Our Products</h1>
      <p>Browse our catalog.</p>
      <p class="promo">Free shipping today!</p>
      <img src="banner.jpg" alt="Seasonal promotional banner">
      <ul>
        <li>Widget A</li>
        <li>Widget B</li>
      </ul>
      <a href="/cart">View Cart</a>
    </div>
  </div>
</body>
</html>
```

**Note beyond pure validation:** the two nested `<div id="main-outer">`/`<div id="main-inner">` wrappers are valid but semantically empty — in a real refactor these would likely become `<main>` and a plain layout `<div>`, but that's a semantics improvement layered on top of, not required by, pure spec validity.
