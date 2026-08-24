# Output: Parent/Child Margin Collapse — What Stops It

```css
.parent { margin-top: 40px; background: #eef; }
.child { margin-top: 25px; }
```

Three versions of the parent, evaluate each:

**A)** `.parent` has no other properties set.
**B)** `.parent` additionally has `padding-top: 1px`.
**C)** `.parent` additionally has `overflow: hidden`.

```html
<div class="parent"><div class="child">Child</div></div>
```

**Answers:**
- **A)** Margins collapse through the parent. The parent's effective top margin becomes `40px` (max of 40/25), and there is **0px** visible gap between the parent's top edge and the child.
- **B)** The 1px of padding breaks the adjacency between the parent's top edge and the child's margin, so collapsing is **prevented**. The parent sits with its own `40px` top margin, AND the child's `25px` top margin now renders *inside* the parent (plus the 1px padding), giving a visible internal gap of `26px` above the child.
- **C)** `overflow: hidden` creates a new block formatting context, which also **prevents** the collapse — same outcome as B in terms of "does it collapse": no. The parent has its own 40px top margin, and internally there's a genuine 25px gap above the child (no extra 1px here, since no padding was added in this version).

**Why:** margin collapsing between a parent and its first child requires there to be nothing — no border, no padding, no line box — separating the parent's top edge from the child's margin, AND no new block formatting context on the parent. Any one of those conditions failing is enough to stop the collapse.
