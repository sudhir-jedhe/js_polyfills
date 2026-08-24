# What Does `:nth-child(3n+1)` Select Here?

```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li>Item 4</li>
  <li>Item 5</li>
  <li>Item 6</li>
  <li>Item 7</li>
</ul>
```

```css
li:nth-child(3n+1) {
  color: red;
}
```

**Answer:** Items 1, 4, and 7 turn red.

**Why:** Plug `n = 0, 1, 2, 3...` into `3n+1`: n=0 → 1, n=1 → 4, n=2 → 7, n=3 → 10 (doesn't exist, stops). So indices 1, 4, and 7 match — "every 3rd item, starting from the 1st."
