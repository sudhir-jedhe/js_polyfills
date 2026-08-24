# Problem: Build a Full Site Shell with Every Standard Landmark

## Problem Statement

Build a reusable page shell (the kind you'd put in a layout template) containing every standard HTML5 landmark region at least once: banner, navigation (two of them — primary and footer nav), main, complementary, and contentinfo. Include a skip link. Assume the content inside `<main>` will vary per page, so just stub it with a placeholder heading.

## Constraints

- Every landmark must be programmatically identifiable and distinguishable if duplicated.
- The skip link must be the very first focusable element in the DOM and must target `<main>`.
- Use `<!DOCTYPE html>` and correct `lang` attribute.
- No landmark should be nested inside another in a way that changes its implicit role incorrectly (e.g. a `<header>` nested inside `<main>` does NOT get the `banner` role — only a direct child of `<body>` does).

## Solution

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Shell</title>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <header>
    <nav aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
    <h1>Page Title Placeholder</h1>
    <!-- per-page content goes here -->
  </main>

  <aside aria-label="Related resources">
    <h2>You Might Also Like</h2>
    <ul><li><a href="/guide">Getting Started Guide</a></li></ul>
  </aside>

  <footer>
    <nav aria-label="Footer">
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
      </ul>
    </nav>
    <p>&copy; 2026 Example Inc.</p>
  </footer>
</body>
</html>
```

**Why this satisfies the constraints:** `<header>` and `<footer>` are direct children of `<body>`, so they correctly get `banner`/`contentinfo` roles. The two `<nav>` elements are distinguished with `aria-label="Primary"` and `aria-label="Footer"`. The skip link is the first element in `<body>` and targets `#main-content`; `tabindex="-1"` on `<main>` ensures it can programmatically receive focus when the skip link is activated (an anchor target alone moves scroll position but doesn't reliably move keyboard focus in every browser without this). The `<aside>` sits as a sibling of `<main>`, not nested inside it, keeping it a page-level complementary region rather than being scoped to the main content only.
