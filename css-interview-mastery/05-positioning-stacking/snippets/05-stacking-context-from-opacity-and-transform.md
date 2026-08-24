# Snippet: `opacity` and `transform` Each Create a Stacking Context on Their Own

```html
<div class="faded">
  <div class="child high-z">z-index: 999, but capped by .faded's context</div>
</div>
<div class="sibling low-z">z-index: 1, in the root stacking context</div>
```

```css
.faded {
  opacity: 0.98; /* < 1, so this alone creates a new stacking context — no position/z-index needed */
}
.child.high-z {
  position: relative;
  z-index: 999;
}
.sibling.low-z {
  position: relative;
  z-index: 1; /* competes against .faded itself (which has implicit stacking rank via DOM/paint order), not against .child */
}
```

Because `.faded` has `opacity: 0.98`, it establishes a stacking context regardless of its `position` or `z-index`. `.child`'s `z-index: 999` only matters *inside* `.faded`'s context — when compared against `.sibling` (a completely separate context, painted later in DOM order and not overridden by any explicit `z-index` competition), `.sibling` still paints on top, because the comparison happens at the `.faded` vs. `.sibling` level, not at the `.child` vs `.sibling` level.
