# Snippet: A Card Component That Responds to Its Container, Not the Viewport

```html
<aside class="sidebar">
  <div class="card-wrapper">
    <article class="card">
      <img src="thumb.jpg" alt="" />
      <div class="card-body"><h3>Title</h3><p>Summary text…</p></div>
    </article>
  </div>
</aside>

<main class="content">
  <div class="card-wrapper">
    <article class="card">
      <img src="thumb.jpg" alt="" />
      <div class="card-body"><h3>Title</h3><p>Summary text…</p></div>
    </article>
  </div>
</main>
```

```css
.card-wrapper {
  container-type: inline-size; /* opts this element in as a query container based on its width */
}

.card {
  display: flex;
  flex-direction: column; /* default: stacked, for narrow containers like the sidebar */
  gap: 8px;
}

/* This query is about the CONTAINER's width, not the viewport's */
@container (min-width: 400px) {
  .card {
    flex-direction: row; /* switches to a side-by-side layout once there's 400px+ of container width */
    align-items: center;
  }
  .card img {
    width: 120px;
    flex-shrink: 0;
  }
}
```

The exact same `.card` markup and CSS renders stacked inside the narrow `.sidebar` and side-by-side inside the wide `.content` column, on the same page, at the same viewport width — because the query is evaluated against each `.card-wrapper`'s own rendered width, independently.
