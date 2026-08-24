# Output: Equal Specificity — Source Order Decides

```css
.btn { color: red; }
.btn { color: blue; }
.cta { color: green; }
.btn.cta { color: orange; }
```
```html
<button class="btn cta">Click me</button>
```

**Question:** What color is the button text?

**Answer:** `orange`

**Why:** `.btn.cta` has specificity (0,2,0) — two classes — which beats `.btn` and `.cta` individually, each (0,1,0). Between the two `.btn` rules (identical specificity), the later one in source order would normally win, but `.btn.cta` outranks both anyway. If `.btn.cta` didn't exist, the answer would be `blue` — the second `.btn` declaration — since equal-specificity rules resolve by "last one in source order wins."
