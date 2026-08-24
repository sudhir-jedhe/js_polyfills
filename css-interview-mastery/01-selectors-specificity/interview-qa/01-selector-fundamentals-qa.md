# Interview Q&A — Selector Fundamentals

**Q: What's the difference between `.a .b`, `.a > .b`, `.a + .b`, and `.a ~ .b`?**
`.a .b` (descendant) matches `.b` anywhere inside `.a`, at any depth. `.a > .b` (child) matches `.b` only when it's a direct child of `.a`. `.a + .b` (adjacent sibling) matches `.b` only when it immediately follows `.a` with the same parent. `.a ~ .b` (general sibling) matches any `.b` that comes after `.a` with the same parent, not necessarily immediately.

**Q: What's the difference between `:hover` and `::before`?**
`:hover` is a pseudo-class — it selects an existing element based on a state (in this case, being hovered). `::before` is a pseudo-element — it generates a new, styleable box that isn't a real DOM node, inserted as the first child of the selected element (and requires a `content` property to actually render).

**Q: How do `:is()` and `:where()` differ, given they both accept a selector list?**
They match identically, but their specificity differs: `:is()` takes on the specificity of its most specific argument, while `:where()` always contributes zero specificity regardless of what's inside it. `:where()` is used specifically when you want the matching logic of a selector list without it adding any specificity weight.

**Q: What does `:not(.a, .b)` select, and what's its specificity?**
It selects any element that matches neither `.a` nor `.b`. Its specificity is the specificity of its most specific argument — since `.a` and `.b` are equal, `:not(.a, .b)` contributes `(0,1,0)`, same as a single class selector.

**Q: Why is `nav a` often considered "too broad" in practice?**
Because the descendant combinator matches at any depth — `nav a` matches every `<a>` inside `<nav>` no matter how deeply nested (inside dropdowns, nested menus, etc.), which is frequently wider than the author intended and a common source of unwanted overrides as markup structure changes.

**Q: What's the difference between `[class~="btn"]` and `[class*="btn"]`?**
`[class~="btn"]` matches when `"btn"` appears as a whole, space-separated word in the `class` attribute (e.g. `class="btn primary"` matches, `class="btn-primary"` does not). `[class*="btn"]` matches on substring containment anywhere in the value, so `class="btn-primary"` would also match.
