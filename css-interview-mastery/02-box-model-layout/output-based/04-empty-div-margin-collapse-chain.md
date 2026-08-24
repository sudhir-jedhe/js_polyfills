# Output: Empty `<div>` Chain Margin Collapse

```css
.gap1 { margin-bottom: 10px; }
.spacer { margin-top: 45px; margin-bottom: 20px; } /* empty, no border/padding/height */
.gap2 { margin-top: 15px; }
```
```html
<div class="gap1">Content</div>
<div class="spacer"></div>
<div class="gap2">Content</div>
```

**Question:** What's the total visible gap between the two content blocks?

**Answer:** `45px`

**Why, step by step:**
1. `.spacer` is empty with no border/padding/height, so its own top (45px) and bottom (20px) margins collapse into a single margin first: `max(45, 20) = 45px`.
2. That single 45px margin is now the "effective" margin representing `.spacer` on both its top and bottom edges simultaneously (since after step 1, `.spacer` behaves as if it had one collapsed margin, not two separate ones).
3. This collapses with `.gap1`'s bottom margin (10px): `max(45, 10) = 45px`.
4. It also collapses with `.gap2`'s top margin (15px): `max(45, 15) = 45px`.
5. Since all of these are transitively the same collapsing group, the final visible gap between `.gap1` and `.gap2` is the single largest margin in the whole chain: **45px** — not `10 + 45 + 20 + 15 = 90px` as naive addition would suggest.
