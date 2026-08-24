# Snippet: Margin Collapsing — Parent and First Child

```css
/* BUGGY: parent's top margin collapses THROUGH it with the child's */
.parent { background: #eef; margin-top: 50px; }
.child { margin-top: 30px; }
```
```html
<div class="parent">
  <div class="child">Child content</div>
</div>
```
Result: there's a single 50px gap **above** `.parent` (pushing the whole parent+child block down), and **zero** visible gap between the parent's top edge and the child — because the margins collapsed through the parent rather than stacking inside it.

```css
/* FIXED: display: flow-root creates a new block formatting context, stopping the collapse */
.parent { background: #eef; margin-top: 50px; display: flow-root; }
.child { margin-top: 30px; }
```
Result: `.parent` sits 50px below whatever precedes it, and there's now a genuine 30px gap *inside* `.parent`, above `.child`, exactly as the padding-box visual model suggests it should.
