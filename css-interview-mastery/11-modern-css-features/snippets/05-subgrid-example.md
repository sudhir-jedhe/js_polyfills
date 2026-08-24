# Snippet: Aligning Card Rows with `subgrid`

```html
<div class="gallery">
  <article class="card">
    <h3>Short Title</h3>
    <p>Body text.</p>
    <button>Action</button>
  </article>
  <article class="card">
    <h3>A Much Longer Title That Wraps Onto Two Lines</h3>
    <p>Body text.</p>
    <button>Action</button>
  </article>
  <article class="card">
    <h3>Title</h3>
    <p>Body text.</p>
    <button>Action</button>
  </article>
</div>
```

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto; /* 3 shared row tracks: title / body / footer */
  gap: 1rem;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* inherit the PARENT's 3 row tracks instead of sizing its own */
  gap: 0.5rem;
}
```

Because every `.card` uses `grid-template-rows: subgrid`, the title/body/footer rows line up across all three cards even though the middle card's title wraps to two lines and needs a taller title row — every card's title row grows to match the tallest one, since they all share the same underlying grid tracks rather than each card computing its own independent row sizes.
