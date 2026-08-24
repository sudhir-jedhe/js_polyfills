# Cascade Layers: Does Specificity Still Matter?

```css
@layer components, utilities;

@layer components {
  #hero.card.card--large.card--elevated { padding: 4rem; }
}

@layer utilities {
  .p-0 { padding: 0; }
}
```

```html
<div id="hero" class="card card--large card--elevated p-0">Content</div>
```

**Question:** What's the final `padding` value?

**Answer:** `0`.

**Why:** The `components`-layer rule has enormous specificity — one ID plus four classes, (1,4,0) — while `.p-0` in the `utilities` layer has minimal specificity, (0,1,0). Normally the ID-laden selector would win by an overwhelming margin. But once both rules are inside *named* `@layer` blocks, specificity comparison only happens **within** the same layer. Across different layers, the layer declared later in the `@layer components, utilities;` order always wins, full stop — specificity is never even consulted. Since `utilities` is declared after `components`, `.p-0`'s `padding: 0` wins despite having drastically lower specificity than the `components` rule. This is the core behavior change `@layer` introduces versus traditional cascade resolution.
