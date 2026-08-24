# Interview Q&A — Modern Selectors: `:has()`, `:is()`, `:where()`

**Q: What problem does `:has()` solve that no prior CSS selector could?**
It lets you select a *parent* (or a preceding sibling relative to what follows it) based on what's inside it or after it — something CSS previously had zero ability to do without JavaScript toggling a class. `.card:has(img)` selects a `.card` that contains an `<img>` anywhere inside it; `h2:has(+ p)` selects an `<h2>` immediately followed by a `<p>`. Both directions (descendant and sibling) were previously impossible to express in pure CSS.

**Q: What specificity does `:has(.foo)` contribute?**
The specificity of its argument — same rule as `:is()` and `:not()`. `:has(.foo)` contributes a class's worth of specificity (0,1,0) to the overall selector, not zero and not some fixed pseudo-class weight.

**Q: What's the practical difference in specificity behavior between `:is()` and `:where()`, given they match identically?**
`:is()` takes on the specificity of its most specific argument (e.g. `:is(#id, .class)` behaves as specific as `#id`). `:where()` always contributes zero specificity no matter what's inside it, even `:where(#id)`. They select exactly the same elements — the only difference is how much specificity weight the rule adds, which matters for how easy the rule is to override later.

**Q: When would you deliberately choose `:where()` over `:is()`?**
When writing reusable, overridable base/default CSS — a component library or design-system reset — where you want consumers of the CSS to be able to override a rule with a single class of their own, without needing higher specificity or `!important`. `:where()` guarantees the base rule stays "weak" on purpose.

**Q: Can `:not()` take multiple selectors, and does that change anything about how it evaluates?**
Modern CSS allows a comma-separated selector list inside `:not()` — `:not(.a, .b, .c)` matches an element that matches none of `.a`, `.b`, or `.c`. It still takes the specificity of its most specific argument, same as `:is()`. (Older CSS only allowed a single simple selector per `:not()`, requiring you to chain multiple `:not()` calls instead — `:not(.a):not(.b)` — which is functionally equivalent but more verbose.)
