*** copy 03-build-skip-link-landmark-navigation.md ***

# Problem: Build a Skip Link and Full Landmark-Based Page Navigation

## Problem Statement

Build a page shell demonstrating complete keyboard-accessible landmark navigation: a skip link as the first focusable element, at least four distinct landmarks (banner, navigation, main, contentinfo), and a small JS-based "jump to landmark" menu that lets a keyboard user open a list of all landmarks and jump directly to any one — simulating what a screen reader's built-in landmarks navigation already does, as a demonstration of the underlying mechanics.

## Constraints

- The skip link must be visually hidden until focused, and focusing it must not break subsequent Tab order.
- The landmark-jump menu itself must be fully keyboard operable (a button that opens a list of links).
- Every landmark jumped to must actually receive focus, not just scroll into view.

## Solution

```html
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <button id="landmarks-btn" aria-haspopup="true" aria-expanded="false" aria-controls="landmarks-menu">
    Jump to section
  </button>
  <ul id="landmarks-menu" role="menu" hidden>
    <li role="none"><a role="menuitem" href="#site-header" data-target="site-header">Header</a></li>
    <li role="none"><a role="menuitem" href="#primary-nav" data-target="primary-nav">Navigation</a></li>
    <li role="none"><a role="menuitem" href="#main-content" data-target="main-content">Main Content</a></li>
    <li role="none"><a role="menuitem" href="#site-footer" data-target="site-footer">Footer</a></li>
  </ul>

  <header id="site-header" tabindex="-1">
    <nav id="primary-nav" tabindex="-1" aria-label="Primary">
      <a href="/">Home</a> <a href="/docs">Docs</a>
    </nav>
  </header>

  <main id="main-content" tabindex="-1">
    <h1>Welcome</h1>
    <p>Page content…</p>
  </main>

  <footer id="site-footer" tabindex="-1">
    <p>&copy; 2026 Example Inc.</p>
  </footer>
</body>
```

```js
const landmarksBtn = document.getElementById('landmarks-btn');
const landmarksMenu = document.getElementById('landmarks-menu');

landmarksBtn.addEventListener('click', () => {
  const isOpen = !landmarksMenu.hidden;
  landmarksMenu.hidden = isOpen;
  landmarksBtn.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) landmarksMenu.querySelector('a').focus();
});

landmarksMenu.addEventListener('click', (e) => {
  const link = e.target.closest('[data-target]');
  if (!link) return;
  e.preventDefault(); // stop the default hash-jump-only behavior, so we can also move real focus
  const target = document.getElementById(link.dataset.target);
  target.focus(); // actually MOVE focus, not just scroll (the default anchor behavior only scrolls in most cases)
  landmarksMenu.hidden = true;
  landmarksBtn.setAttribute('aria-expanded', 'false');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !landmarksMenu.hidden) {
    landmarksMenu.hidden = true;
    landmarksBtn.setAttribute('aria-expanded', 'false');
    landmarksBtn.focus();
  }
});
```

**Why this satisfies the constraints:** the skip link is the very first element in `<body>`, using the standard visually-hidden-until-focus CSS pattern (see the skip-link snippet), so it doesn't disturb the natural tab order of anything after it. Each landmark target has `tabindex="-1"` specifically so `.focus()` calls actually work (the default click/anchor behavior only scrolls in many browsers, which is why `e.preventDefault()` plus an explicit `.focus()` call is necessary rather than relying on the `href="#id"` alone). The landmark-jump menu itself follows a minimal `role="menu"`/`menuitem` pattern with `aria-expanded` state and an `Escape` handler, mirroring the same accessible-disclosure conventions used throughout this topic.
