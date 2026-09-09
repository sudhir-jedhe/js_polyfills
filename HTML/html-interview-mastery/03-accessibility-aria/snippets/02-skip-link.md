***  02-skip-link.md ***

# Snippet: Skip Link

```html
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <header>
    <nav aria-label="Primary">
      <!-- many nav links a keyboard user would otherwise have to tab through every page load -->
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
    <h1>Page Content</h1>
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  left: -9999px; /* off-screen, but NOT display:none — must stay focusable */
  top: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  z-index: 1000;
}

.skip-link:focus {
  left: 8px; /* moves into view the instant it's focused via Tab */
  top: 8px;
}
```

`tabindex="-1"` on `<main id="main-content">` is required so `.focus()` can be called on it programmatically after the skip link is activated — without it, some browsers will scroll the page to the anchor but won't actually move keyboard focus there, meaning the very next Tab press would resume from the top of the page rather than from inside `<main>`.
