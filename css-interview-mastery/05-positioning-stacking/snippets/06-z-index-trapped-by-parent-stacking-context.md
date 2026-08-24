# Snippet: `z-index: 9999` Losing to `z-index: 1` (Trapped in a Parent Stacking Context)

```html
<header class="site-header">
  <nav class="dropdown">
    <div class="menu">z-index: 9999</div>
  </nav>
</header>
<main class="hero">
  <div class="overlay">z-index: 1</div>
</main>
```

```css
.site-header {
  position: relative;
  z-index: 1;        /* .site-header's own stacking-context rank */
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 0.1)); /* creates a stacking context, unrelated to the intent */
}
.menu {
  position: absolute;
  z-index: 9999;      /* only ranks within .site-header's context — never escapes it */
}

.hero {
  position: relative;
  z-index: 2;          /* .hero outranks .site-header (2 > 1) at the parent level */
}
.overlay {
  position: absolute;
  z-index: 1;
}
```

`.overlay` (`z-index: 1`) paints above `.menu` (`z-index: 9999`), because the only comparison that matters at the top level is `.site-header` (context rank `1`) vs. `.hero` (context rank `2`) — `.hero` wins, so everything inside it, including `.overlay`, paints on top of everything inside `.site-header`, regardless of `.menu`'s internal `z-index`. The fix is either raising `.site-header`'s `z-index` above `.hero`'s, or removing the `filter` that (accidentally) locked `.menu` inside `.site-header`'s stacking context in the first place.
