# Container Query vs. Media Query: Which One Fires?

```html
<div class="page"> <!-- viewport-level layout, currently 1400px wide -->
  <aside class="sidebar"> <!-- 260px wide, container-type: inline-size -->
    <div class="widget">Widget content</div>
  </aside>
</div>
```

```css
.sidebar { container-type: inline-size; }

@media (min-width: 1024px) {
  .widget { border: 2px solid blue; }
}

@container (min-width: 1024px) {
  .widget { background: yellow; }
}
```

**Question:** The viewport is `1400px` wide. `.sidebar` (the query container) is only `260px` wide. Which rule(s) apply to `.widget` — the `border: blue` from `@media`, the `background: yellow` from `@container`, both, or neither?

**Answer:** Only the `border: blue` rule from `@media` applies. The `@container` rule does not apply.

**Why:** `@media (min-width: 1024px)` checks the *viewport's* width, which is `1400px` — well above `1024px`, so it matches regardless of anything about `.sidebar` or `.widget`. `@container (min-width: 1024px)`, by contrast, checks the width of `.widget`'s nearest ancestor that's a query container — `.sidebar`, which is only `260px` wide. `260px < 1024px`, so the container query condition is false and its rule doesn't apply, even though the viewport itself is plenty wide. This is exactly the point of container queries: they're deliberately blind to viewport size and only care about the actual space available in their specific container, which is why the same `.widget` component can (and in this case does) get a completely different set of applicable rules than a viewport-based `@media` query would suggest.
