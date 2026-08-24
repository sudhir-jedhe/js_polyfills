# What Happens If You Forget `grid-row: span`?

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1rem;
}

.card {
  display: grid;
  grid-template-rows: subgrid; /* NOTE: no grid-row set on .card itself */
}
```

```html
<div class="gallery">
  <article class="card"><h3>Title</h3><p>Body</p><button>Go</button></article>
  <article class="card"><h3>Title</h3><p>Body</p><button>Go</button></article>
</div>
```

**Question:** Does `grid-template-rows: subgrid` on `.card` correctly align each card's title/body/footer rows to the gallery's three row tracks?

**Answer:** No — with no `grid-row` explicitly set, each `.card` defaults to spanning only **one** row track of `.gallery` (a single implicit row, `grid-row: auto`, which resolves to span 1). `subgrid` needs the subgridding element to span the *same number of row tracks it intends to subdivide* — since `.card` only occupies 1 row track by default, `grid-template-rows: subgrid` has only a single track to work with, so the card's internal title/body/footer end up collapsing into that one row rather than spreading across three aligned tracks.

**Fix:** explicitly give `.card` `grid-row: span 3;` so it occupies three of the parent's row tracks — matching the three rows (`auto auto auto`) it's meant to subgrid into. Only then does `grid-template-rows: subgrid` have three parent tracks to align its own title/body/footer rows to, producing the intended cross-card alignment.
