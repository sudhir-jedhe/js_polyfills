# Snippet: `justify-content` and `align-items`

```css
.hero {
  display: flex;
  height: 300px;
  justify-content: center; /* centers along the main axis (horizontal, row is default) */
  align-items: center;     /* centers along the cross axis (vertical) */
  background: #222;
}
.hero__title {
  color: white;
  font-size: 2rem;
}
```

```html
<section class="hero">
  <h1 class="hero__title">Centered in Both Dimensions</h1>
</section>
```

This is the standard flexbox centering recipe — no `margin: auto` tricks, no `position: absolute` + `transform`, just two alignment properties on the container.
