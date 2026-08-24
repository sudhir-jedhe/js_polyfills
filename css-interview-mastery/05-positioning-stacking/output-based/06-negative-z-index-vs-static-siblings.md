# Negative `z-index` vs. Normal-Flow Siblings

```html
<div class="card">
  <div class="background-decoration">decoration</div>
  <p>Card text content, in normal flow</p>
</div>
```

```css
.card {
  position: relative;
  background: white;
}
.background-decoration {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(45deg, #eee, #ccc);
}
```

**Question:** Does `.background-decoration` (with `z-index: -1`) paint behind or in front of the `<p>` text, and behind or in front of `.card`'s own background?

**Answer:** It paints **in front of** `.card`'s own background/border, but **behind** the `<p>` text.

**Why:** Within a single stacking context (here, the one established by `.card`, since it's `position: relative` — note `.card` itself doesn't need a `z-index` for its *own* background/border to be the base layer of the context it creates for its descendants), paint order from back to front is: (1) the context-root's own background/border, (2) descendants with negative `z-index` — most negative first, (3) normal-flow, non-positioned block/inline descendants, (4) descendants that create their own stacking contexts with `z-index: 0`/`auto`, (5) descendants with positive `z-index`. `.background-decoration` sits in bucket (2), which paints after bucket (1) — `.card`'s background — but before bucket (3), the `<p>` text. So the gradient appears above the plain white card background but is itself covered by the paragraph text, which is exactly the intended "decorative background layer" effect. This is the standard technique for absolute/`inset: 0` decorative layers that shouldn't obscure content, without needing any `z-index` on the content itself.
