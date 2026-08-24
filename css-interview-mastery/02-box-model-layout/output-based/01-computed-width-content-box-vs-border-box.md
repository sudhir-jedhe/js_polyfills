# Output: Computed Width, `content-box` vs. `border-box`

```css
.box {
  width: 300px;
  padding: 15px;
  border: 5px solid black;
  margin: 10px;
}
```

**Question:** What is the total rendered width of `.box` (border edge to border edge), and how much horizontal space does it occupy in its parent (including margin), under the default `box-sizing`? Then, what changes if `box-sizing: border-box` is added?

**Answer (default, `content-box`):**
- Rendered width (border-to-border) = `300 (content) + 15+15 (padding) + 5+5 (border) = 340px`.
- Total space occupied in parent (including margin) = `340 + 10+10 (margin) = 360px`.

**Answer (with `box-sizing: border-box`):**
- Rendered width (border-to-border) = exactly `300px` — padding and border are now subtracted from the content area instead of added on top (content area becomes `300 - 30 - 10 = 260px`).
- Total space occupied in parent (including margin) = `300 + 10+10 = 320px`.

**Why:** margin is never part of either `box-sizing` calculation in any mode — it always adds on top of the border-box regardless. The only thing `box-sizing` changes is whether `width` measures content-only (`content-box`) or content+padding+border together (`border-box`).
