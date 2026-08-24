# `:nth-child(2)` vs `:nth-of-type(2)` with Mixed Siblings

```html
<article>
  <h2>Heading</h2>
  <p>Paragraph A</p>
  <p>Paragraph B</p>
  <p>Paragraph C</p>
</article>
```

```css
p:nth-child(2) { color: blue; }
p:nth-of-type(2) { color: green; }
```

**Answer:** "Paragraph A" turns blue. "Paragraph B" turns green. "Paragraph C" stays unstyled.

**Why:** Counting all children of `<article>` regardless of tag: `<h2>` is child 1, "Paragraph A" is child 2, "Paragraph B" is child 3, "Paragraph C" is child 4. `p:nth-child(2)` matches an element that is simultaneously a `<p>` *and* the 2nd child overall — that's "Paragraph A" — so it's blue.

`:nth-of-type(2)` ignores the `<h2>` entirely and counts only among `<p>` siblings: "Paragraph A" is type-index 1, "Paragraph B" is type-index 2. So `p:nth-of-type(2)` matches "Paragraph B", which turns green.

This is the classic case where the two selectors diverge: whenever siblings mix tag types, `:nth-child()` and `:nth-of-type(n)` with the same `n` will generally pick different elements, because one counts overall position and the other counts position within same-tag siblings only.
