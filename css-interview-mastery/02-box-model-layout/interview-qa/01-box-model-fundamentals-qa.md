# Interview Q&A — Box Model Fundamentals

**Q: List the four layers of the CSS box model, from innermost to outermost.**
Content, padding, border, margin. Content is where text/children render; padding is transparent space inside the border; border is the visible line around the padding; margin is transparent space outside the border used for spacing between elements.

**Q: What's the difference between `content-box` and `border-box`?**
`content-box` (the default) makes `width`/`height` measure only the content area, so padding and border add on top of the declared size, growing the total box. `border-box` makes `width`/`height` measure content + padding + border together, so the content area shrinks to accommodate padding/border while the total declared size stays fixed.

**Q: Why do most real-world projects apply `box-sizing: border-box` globally?**
Because `content-box` math makes percentage-based and responsive sizing unpredictable — a child at `width: 50%` with any padding can silently overflow its parent. `border-box` makes `width`/`height` behave as "this is the actual total size," which is almost always what a developer intends and expects.

**Q: Does `background-color` paint into the margin area?**
No. Background paints under the content and padding, up to the outer border edge by default (`background-clip: border-box`) — margin is always transparent and never receives background painting.

**Q: Can margin be negative? What does that do?**
Yes — negative margin pulls an element (and, via collapsing, potentially its neighbors) closer than default spacing would allow, commonly used to counteract a parent's padding or intentionally overlap elements.
