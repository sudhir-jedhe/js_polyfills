# Output: Cascade Layer Order Beats Specificity

```css
@layer base, components;

@layer base {
  #hero-title { color: crimson; } /* specificity (1,0,0) — very strong */
}

@layer components {
  .title { color: navy; } /* specificity (0,1,0) — much weaker */
}
```
```html
<h1 id="hero-title" class="title">Welcome</h1>
```

**Question:** What color is the heading?

**Answer:** `navy`

**Why:** For normal (non-`!important`) declarations, layer order is compared *before* specificity. `components` is declared after `base`, so any matching rule inside `components` beats any matching rule inside `base`, no matter how much higher the `base` rule's specificity is. Specificity is only used to break ties *within* the same layer (or between unlayered rules, or between two layers declared with equal priority — which isn't possible, since `@layer` order is a strict list).
