# Snippet: `fixed` Pinned to Viewport — Until an Ancestor Has a `transform`

```html
<div class="panel">
  <button class="close-btn">×</button>
</div>
```

```css
/* Case A: pinned to the viewport, as expected */
.panel {
  /* no transform, no filter, no will-change here */
}
.close-btn {
  position: fixed;
  top: 16px;
  right: 16px; /* stays in the viewport corner regardless of page scroll */
}
```

```css
/* Case B: the SAME .close-btn CSS, but .panel now has a transform */
.panel {
  transform: translateZ(0); /* identity transform, often added as an old perf hack */
}
.close-btn {
  position: fixed;
  top: 16px;
  right: 16px; /* now pinned to .panel's corner, and scrolls away WITH .panel */
}
```

Nothing changed on `.close-btn` between Case A and Case B — only `.panel` gained a `transform`. That alone is enough to make `.panel` the containing block for any `fixed` descendant, because `transform` (along with `filter`, `perspective`, `backdrop-filter`, and `will-change` naming one of those) opts an element into being a containing block for `fixed`/`absolute` positioning, not just the viewport default.
