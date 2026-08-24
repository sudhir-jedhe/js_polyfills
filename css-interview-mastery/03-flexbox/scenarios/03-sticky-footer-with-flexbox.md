# Scenario: Footer That Won't Stay at the Bottom on Short Pages

**Scenario:** A site's footer is supposed to sit at the bottom of the viewport on pages with little content (e.g. an empty search-results state), but instead it renders right below the sparse content, leaving a large gap of visible page background underneath it before the actual bottom of the browser window. On pages with enough content to fill the viewport, the footer looks correct. How do you fix this with flexbox?

**Diagnosis:** This is the classic "sticky footer" problem — nothing is telling the page's main content area to grow and consume the remaining viewport height when there isn't enough content to naturally push the footer down. The footer is rendering exactly where the document flow puts it (right after the short content), not at the bottom of the *viewport*.

**Fix:**

```css
html, body {
  height: 100%;
  margin: 0;
}
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* the whole page is at least as tall as the viewport... */
}
.page__main {
  flex: 1 1 auto; /* ...and this element absorbs ALL the leftover space, pushing the footer down */
}
.page__footer {
  flex: 0 0 auto; /* stays at its natural content height */
}
```

```html
<div class="page">
  <header>Header</header>
  <main class="page__main"><!-- sparse content --></main>
  <footer class="page__footer">Footer</footer>
</div>
```

**Why this works:** `.page` is a `column`-direction flex container with `min-height: 100vh`, so it's guaranteed to be at least the full viewport height even when its content is short. `.page__main` with `flex: 1 1 auto` is the only flexible item in the column, so it grows to absorb *all* the leftover vertical space between the header and footer — which is exactly what pushes the footer down to the true bottom of the viewport on short pages, while still allowing the whole page (and the footer with it) to grow taller than the viewport and scroll normally on pages with enough content to overflow it (`min-height`, not a fixed `height`, is what makes both cases work correctly).

**Common mistake to avoid:** using `height: 100vh` instead of `min-height: 100vh` on `.page` — a fixed `height` would clip/overflow content on genuinely long pages instead of letting the page grow past the viewport naturally.
