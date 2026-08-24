# Output: Attribute Selector vs. Class Selector

```css
.foo { border-color: black; }
input[type="text"] { border-color: gray; }
```
```html
<input type="text" class="foo" />
```

**Question:** What's the border color?

**Answer:** `gray`

**Why:** Attribute selectors count in the *same* specificity column as classes and pseudo-classes. `.foo` is (id:0, class:1, type:0). `input[type="text"]` is (id:0, class:1, type:1) — the attribute selector contributes 1 to the class column, and the `input` type selector contributes 1 to the type column. The class column ties at 1, so the type column breaks the tie: `1 > 0`, and `input[type="text"]` wins.
