# Output: Inline Style vs. `!important`

```css
p { color: green !important; }
```
```html
<p style="color: purple;">Text</p>
```

**Question:** What color is the text?

**Answer:** `green`

**Why:** Inline styles have higher *specificity* than any selector-based rule, but `!important` doesn't compete on specificity at all — it promotes the declaration into a higher tier of the cascade that is evaluated *before* specificity is ever consulted. Normal declarations (including inline styles) always lose to `!important` declarations from the same origin (author stylesheet), regardless of specificity.
