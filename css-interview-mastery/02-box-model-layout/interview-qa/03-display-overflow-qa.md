# Interview Q&A — Display and Overflow

**Q: What's the difference between `display: none` and `visibility: hidden`?**
`display: none` removes the element from the render tree entirely — it takes up zero layout space, as if it weren't in the document. `visibility: hidden` hides the element visually but still reserves its layout space; siblings don't reflow into that space.

**Q: Why does setting `width`/`height` on an `inline` element have no effect?**
Because `inline` boxes participate in line-box layout the same way text runs do — their size is determined by their content, and the inline formatting model doesn't consult `width`/`height` at all for inline-level boxes. `inline-block` exists specifically to opt back into `width`/`height`/full margin support while still flowing inline with surrounding content.

**Q: What's the classic whitespace gap bug with `inline-block`, and how do you avoid it?**
Adjacent `inline-block` elements separated by whitespace (a line break or space) in the HTML source render with a small visible gap between them, because that whitespace is literal inline content. Fixes include removing the whitespace in markup, setting the parent's `font-size: 0`, or — the modern default choice — using `display: flex` instead, which has no such whitespace-sensitivity.

**Q: What side effect does `overflow: hidden` have beyond clipping content?**
It establishes a new block formatting context (BFC) for the element. That has two knock-on effects: it fully contains floated descendants (the classic "clearfix via overflow" trick), and it prevents margin collapsing between the element and its children.

**Q: Why is `display: flow-root` often preferred over `overflow: hidden` purely for BFC creation?**
Because `flow-root` establishes a new BFC with no other side effects — it doesn't clip overflowing content or add scrollbars. `overflow: hidden` gets you a BFC "for free" but also clips anything that legitimately needs to render outside the box (dropdowns, tooltips, shadows), which is often an unwanted side effect if clipping wasn't the actual goal.
