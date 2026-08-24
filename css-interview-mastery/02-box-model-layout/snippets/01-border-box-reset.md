# Snippet: Universal `border-box` Reset

```css
*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 24px;
  border: 2px solid #333;
  /* total rendered width is still exactly 300px — content area shrinks to 300 - 48 - 4 = 248px */
}
```

```html
<div class="card">This card is exactly 300px wide, no matter how much padding/border it has.</div>
```

Without the reset (`content-box`, the default), the same card would render at `300 + 48 + 4 = 352px` wide — 52px wider than declared.
