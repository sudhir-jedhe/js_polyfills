# Output: Adjacent Sibling Margin Collapse Result

```css
.a { margin-bottom: -15px; }
.b { margin-top: 40px; }
```
```html
<div class="a">A</div>
<div class="b">B</div>
```

**Question:** What's the visible gap between `.a` and `.b`?

**Answer:** `25px`

**Why:** when collapsing margins of mixed sign, the result is the **sum** of the largest positive margin and the smallest (most negative) margin: `40 + (-15) = 25px`. This is different from the "both positive → take the max" rule — mixed-sign collapsing is additive, not a max/min pick.
