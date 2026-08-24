# Output: Universal Selector and Combinators Contribute Zero

```css
* > .item + .item { color: teal; }
.list .item { color: coral; }
```
```html
<ul class="list">
  <li class="item">One</li>
  <li class="item">Two</li>
</ul>
```

**Question:** What color is the text "Two"?

**Answer:** `teal`

**Why:** `* > .item + .item` looks intimidating but the universal selector (`*`) and both combinators (`>` and `+`) contribute nothing to specificity — only the two `.item` compound selectors count, giving (id:0, class:2, type:0). `.list .item` is (id:0, class:2, type:0) as well — a tie. With a tie, source order decides, and `* > .item + .item` appears second in the stylesheet, so it wins for the second `<li>` (the first `<li>`, "One", isn't matched by `* > .item + .item` at all, since there's no preceding `.item` sibling — it only ever gets `coral` from the second rule).
