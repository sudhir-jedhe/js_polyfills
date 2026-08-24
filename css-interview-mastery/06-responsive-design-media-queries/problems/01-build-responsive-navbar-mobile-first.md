# Problem: Build a Mobile-First Responsive Navbar

## Problem Statement

Build a site navbar that shows a hamburger-triggered stacked menu on small screens, and a horizontal inline nav on larger screens — written mobile-first, with the small-screen layout as the unqualified base styles.

## Requirements

- Below 768px: logo + hamburger button visible; nav links hidden by default, shown as a full-width stacked list when the hamburger is toggled open.
- At 768px and above: hamburger button is hidden entirely; nav links are always visible, laid out horizontally.
- Must be written mobile-first (`min-width` queries only, base styles are the mobile layout).
- No layout shift/flash of incorrectly-styled content on load.

## Approach

Base (unqualified) CSS defines the mobile layout: hidden nav list, visible hamburger, and a `.is-open` class toggled by JS controls visibility on small screens. A single `min-width: 768px` media query then overrides just enough to switch to the desktop layout — hiding the hamburger and forcing the nav list to always display horizontally, regardless of the `.is-open` state (so the JS toggle becomes irrelevant once desktop styles apply).

## Solution

```html
<header class="site-header">
  <a class="logo" href="/">Brand</a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="nav-list">
    <span class="sr-only">Menu</span>
    ☰
  </button>
  <nav>
    <ul id="nav-list" class="nav-list">
      <li><a href="/products">Products</a></li>
      <li><a href="/pricing">Pricing</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
```

```css
/* --- Base styles = mobile default --- */
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.nav-toggle {
  display: inline-flex; /* visible by default on mobile */
  background: none;
  border: none;
  font-size: 1.5rem;
}

.nav-list {
  display: none; /* hidden by default on mobile, until toggled */
  flex-direction: column;
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  background: white;
  padding: 8px 16px;
  list-style: none;
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.1);
}

.nav-list.is-open {
  display: flex; /* JS toggles this class on hamburger click */
}

/* --- Desktop and up: progressively override the mobile base --- */
@media (min-width: 768px) {
  .nav-toggle {
    display: none; /* no hamburger needed once nav is always visible */
  }

  .nav-list {
    display: flex !important; /* always visible, regardless of .is-open toggle state */
    position: static;
    flex-direction: row;
    gap: 24px;
    box-shadow: none;
    padding: 0;
  }
}
```

```js
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

toggle.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});
```

**Why `!important` on `.nav-list`'s `display` inside the media query, specifically:** without it, if the user had opened the mobile menu (`.is-open` applied) and then resized past 768px, `.nav-list.is-open`'s `display: flex` (from the base rule, boosted only by the extra `.is-open` class — same specificity level as the media query's plain `.nav-list` selector) could tie or conflict with the desktop override in ways that depend on source order and exact selector specificity; forcing it here guarantees desktop layout always wins outright regardless of whatever state the mobile toggle was left in. An alternative, arguably cleaner fix is giving the desktop-only rule a slightly higher-specificity selector instead of reaching for `!important` — either approach is defensible, but the reasoning about *why* a conflict exists at all (leftover mobile-only state class) is the important interview-relevant insight here.
