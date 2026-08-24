# Scenario: Highlighting Every 4th Card in a Dynamically-Rendered Grid

**Situation:** A product grid is rendered from an API response — the number of cards varies per page load, and there's no way to add a class to "every 4th card" server-side without extra templating logic. Design wants every 4th card to have a slightly different background as a subtle rhythm break.

**Approach:**

```html
<div class="grid">
  <div class="card">1</div>
  <div class="card">2</div>
  <div class="card">3</div>
  <div class="card">4</div>
  <!-- ...however many more, count unknown ahead of time -->
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.card:nth-child(4n) {
  background: #f3f4f6;
}
```

**Why this works:** `:nth-child(4n)` matches every 4th `.card` regardless of the total count — 4, 8, 12, 16... — so it scales automatically as the API returns more or fewer items, with zero JavaScript and no server-side "index % 4" templating logic needed. This is a common case where a formula-based structural pseudo-class replaces what would otherwise be per-item conditional class logic in the rendering layer. If the grid ever mixes `.card` elements with other element types as direct siblings (e.g. an inline ad unit every so often), switch to `:nth-of-type(4n)` scoped with a matching selector, or better, wrap non-card content so it isn't a sibling of `.card` at all — otherwise the "every 4th" count would silently include non-card elements.
