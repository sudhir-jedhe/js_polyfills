# Does the Nested Element Inherit the Custom Property?

```html
<div class="outer">
  <div class="inner">
    <p class="text">Some text</p>
  </div>
</div>
```

```css
.outer {
  --accent: purple;
  border: 4px solid red;
}
.text {
  color: var(--accent);
  border: inherit; /* explicit opt-in, since border doesn't inherit by default */
}
```

**Question:** What color is `.text`'s text? Does `.text` get a red border?

**Answer:** The text is purple. `.text` does **not** get a red border, despite the `border: inherit;` line, unless `.inner` itself has no competing `border` declaration of its own to inherit from instead.

**Why:** `--accent: purple` is a custom property, and custom properties inherit by default — `.text` has no competing declaration of its own for `--accent`, so it inherits `purple` straight through `.inner` (which also doesn't redeclare it) from `.outer`, and `var(--accent)` resolves to `purple`. `border`, by contrast, does **not** inherit by default — the explicit `border: inherit;` on `.text` only inherits from `.text`'s *direct parent*, `.inner`, not from `.outer` two levels up. Since `.inner` never set its own `border` (and `border`'s initial value is `none`/no border, which `.inner` therefore has, since it doesn't inherit from `.outer` either), `.text` inherits `.inner`'s actual value — no border — not `.outer`'s red border. This contrast is exactly the point: custom properties silently inherit through any number of intermediate levels by default, while normal properties like `border` need an explicit `inherit` keyword, and even then only reach one level up, to the direct parent's own resolved value.
