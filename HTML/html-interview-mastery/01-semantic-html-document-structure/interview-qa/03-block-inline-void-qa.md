*** copy 03-block-inline-void-qa.md ***

# Interview Q&A — Block, Inline, and Void Elements

**Q: What's the difference between "block-level" in HTML and `display: block` in CSS?**
"Block-level" (HTML sense) is a content-model category the spec assigns to specific elements (`div`, `p`, `section`, etc.) that governs valid nesting rules, independent of styling. `display: block` is a CSS rendering instruction that can be applied to *any* element, including inherently inline ones (`span { display: block }`), and changing it never changes the element's underlying HTML content-model category, its default ARIA role, or what the parser considers valid to nest inside it.

**Q: What is a void element, and can you name several?**
An element that can never have children and therefore has no closing tag — the tag itself is the complete element. The full list: `area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr`. It's a closed, spec-defined list, not a general "self-closing" concept you can extend to arbitrary tags.

**Q: Is `<br />` required, or does `<br>` work the same?**
They're identical in HTML5 — the trailing slash is optional and has zero parsing effect; it's a holdover from XHTML, where void elements had to be self-closed to be well-formed XML. Some teams still enforce the slash via a formatter for stylistic consistency with JSX, but it's not required.

**Q: What happens if you try to nest a block-level element inside a `<p>`?**
The parser force-closes the `<p>` the instant it encounters the block-level element, because `<p>`'s content model only permits phrasing (inline-level) content. The block element and anything after it become siblings after the now-closed `<p>`, not children of it — this can silently break CSS/JS that assumed a nested structure, even though the browser doesn't throw a visible error.

**Q: Can `<a>` wrap block-level content like a `<div>`?**
Yes, as of HTML5 — this was explicitly relaxed from HTML4/XHTML, where `<a>` was strictly inline-only. `<a href="..."><div>...</div></a>` is valid and is the standard pattern for making an entire "card" component clickable.

**Q: What's the difference between a void element and a "replaced element"?**
They're orthogonal categories. "Void" is a syntax property (can't have children/no closing tag). "Replaced element" is a CSS rendering concept — content supplied by an external resource (`img`, `video`, `iframe`, `canvas`). Most void elements are also replaced elements, but `<input>` is void yet only visually "replaced" in some cases (e.g. `type="image"`), and `<iframe>` is replaced but not void — it requires a closing tag.
