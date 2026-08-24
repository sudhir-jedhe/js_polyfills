# What Paints on Top: `z-index: 9999` vs `z-index: 1`

```html
<div class="a">
  <div class="inner-a">A's child</div>
</div>
<div class="b">
  <div class="inner-b">B's child</div>
</div>
```

```css
.a { position: relative; z-index: 5; opacity: 0.99; }
.inner-a { position: relative; z-index: 9999; }

.b { position: relative; z-index: 6; }
.inner-b { position: relative; z-index: 1; }
```

**Question:** Which of `.inner-a` and `.inner-b` paints on top?

**Answer:** `.inner-b` (despite `z-index: 1`, vastly lower than `.inner-a`'s `9999`).

**Why:** `.a` has `opacity: 0.99`, which creates a new stacking context, so `.inner-a`'s `z-index: 9999` only ranks against other elements inside `.a`'s context — there are none, so it's irrelevant to anything outside. The comparison that actually decides final paint order is `.a` (rank `5`) vs. `.b` (rank `6`), both top-level stacking contexts under the root. Since `6 > 5`, all of `.b`'s content — including `.inner-b` — paints above all of `.a`'s content, no matter what `z-index` is buried inside `.a`.
