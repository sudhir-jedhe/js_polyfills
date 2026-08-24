# Snippet: Subgrid for Cross-Card Row Alignment

```css
.card-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 16px;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* align to the PARENT's row tracks instead of sizing independently */
}

.card__title  { grid-row: 1; padding: 12px; font-weight: 600; }
.card__body   { grid-row: 2; padding: 12px; }
.card__footer { grid-row: 3; padding: 12px; border-top: 1px solid #eee; }
```

```html
<div class="card-row">
  <div class="card">
    <div class="card__title">Short Title</div>
    <div class="card__body">Body text.</div>
    <div class="card__footer">Footer</div>
  </div>
  <div class="card">
    <div class="card__title">A Much Longer Title That Wraps Onto Two Lines</div>
    <div class="card__body">Body text.</div>
    <div class="card__footer">Footer</div>
  </div>
  <div class="card">
    <div class="card__title">Short Title</div>
    <div class="card__body">Body text.</div>
    <div class="card__footer">Footer</div>
  </div>
</div>
```

Because every `.card` uses `grid-template-rows: subgrid`, the title row's height across ALL three cards grows to match the tallest title (the two-line one in card 2) — every card's body and footer stay aligned to the same row boundaries, without any JS measurement or manual height-setting.
