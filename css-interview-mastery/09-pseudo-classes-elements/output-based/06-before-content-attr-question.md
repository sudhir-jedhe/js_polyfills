# What Renders From This `::before` Rule?

```html
<span class="price" data-currency="USD">42.00</span>
<img class="avatar" src="user.png" data-currency="USD" />
```

```css
.price::before {
  content: attr(data-currency) " ";
}
.avatar::before {
  content: attr(data-currency) " ";
}
```

**Question:** What text appears before each element, if anything?

**Answer:** The `<span>` renders "USD 42.00". The `<img>` shows nothing extra — no generated content appears before it at all.

**Why:** `::before`/`::after` only work on regular elements, not *replaced elements* like `<img>`, `<input>`, `<video>`. A replaced element's box is filled by external content (the image itself) rather than by rendered child content, so there's no "content box" for a pseudo-element to be inserted into — browsers simply ignore `::before`/`::after` on them. `<span>` is a normal (non-replaced) inline element, so its generated content renders normally, reading the `data-currency` attribute via `attr()`.
