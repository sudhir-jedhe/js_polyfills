# Snippet: Margin Collapsing — Adjacent Siblings

```css
.section-a { margin-bottom: 40px; background: #eef; }
.section-b { margin-top: 25px; background: #fee; }
```

```html
<div class="section-a">Section A</div>
<div class="section-b">Section B</div>
```

The visible gap between the two sections is **40px** — the larger of `40px` and `25px` — not `65px`. To get an actual `65px` gap here, one common (if slightly blunt) fix is to only ever set margin in one direction consistently (e.g. always `margin-bottom`, never `margin-top`), which sidesteps having to reason about collapsing between siblings at all.
