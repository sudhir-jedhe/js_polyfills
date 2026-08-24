# Which `<li>` Elements Does `:has()` Match?

```html
<ul>
  <li>Plain item</li>
  <li>Item with <a href="#">a link</a></li>
  <li>Item with <strong>bold text</strong></li>
  <li><a href="#">Entirely a link</a></li>
</ul>
```

```css
li:has(a) {
  background: #fef3c7;
}
```

**Answer:** The 2nd and 4th `<li>` elements get the yellow background. The 1st (plain text) and 3rd (`<strong>` only, no `<a>`) do not.

**Why:** `li:has(a)` matches an `<li>` if it has a descendant `<a>` anywhere inside it — it doesn't matter whether the `<a>` wraps the entire content (4th item) or just part of it (2nd item), and it doesn't require the `<a>` to be a direct child. The 3rd item has a `<strong>` but no `<a>` descendant at all, so `:has(a)` doesn't match it.
