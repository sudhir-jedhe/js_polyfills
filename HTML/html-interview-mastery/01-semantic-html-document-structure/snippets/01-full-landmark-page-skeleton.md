***  01-full-landmark-page-skeleton.md ***

# Snippet: Full Landmark Page Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landmark Skeleton Example</title>
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>

  <header>
    <h1>Site Name</h1>
    <nav aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <h2>Page Heading</h2>
    <p>Main, unique page content goes here.</p>

    <aside aria-label="Related links">
      <h2>Related</h2>
      <ul><li><a href="#">Related article</a></li></ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Site Name. All rights reserved.</p>
  </footer>
</body>
</html>
```

Every top-level region here is a landmark: `banner` (header), `navigation` (nav), `main`, `complementary` (aside), `contentinfo` (footer) — a screen reader user can jump between all five without reading a word of content.
