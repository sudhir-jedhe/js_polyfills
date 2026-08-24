# Interview Q&A — Architecture and Best Practices

**Q: Why is BEM described as a "specificity-avoidance strategy" rather than just a naming convention?**
Because every BEM selector is a single class, giving every rule identical specificity `(0,1,0)`. This means the cascade never has to arbitrate between different-weight selectors within your component CSS — the only variable left is source order, which is fully within your control. The naming convention (Block__Element--Modifier) is really just the human-readable side-effect of that flatness constraint.

**Q: When is it acceptable to use an ID selector for styling?**
Rarely in component CSS — IDs create very high, hard-to-override specificity that fights with class-based systems like BEM. It's more defensible for singleton page landmarks that will never be duplicated or need overriding (e.g. `#page-root` for a top-level layout hook), and even then many teams prefer a class for consistency's sake, reserving IDs purely for JS hooks or anchor links.

**Q: What's a practical, low-risk first step for taming a legacy stylesheet with widespread `!important` usage?**
Wrap the existing CSS in a named cascade layer (e.g. `@layer legacy`) and put new/overriding CSS in a layer declared after it (e.g. `@layer app`). This gives the new CSS guaranteed priority over the old, specificity-independent, without touching a single existing selector — letting you remove `!important` and inflated selectors incrementally instead of in one risky pass.

**Q: How would you prevent a specificity war from recurring after cleaning one up?**
Make priority explicit and enforced rather than implicit: adopt cascade layers with an agreed, documented order (e.g. `reset, vendor, base, components, utilities`), lint against new `!important` and ID selectors in component CSS (e.g. via `stylelint`), and keep component selectors flat (BEM or similar) so escalation is never "the easy fix."

**Q: Why might a team deliberately use `:where()` inside a component library's base styles?**
So consumers of the library can override those base styles with an ordinary, low-specificity class selector without needing `!important` or extra selector weight. E.g. a library shipping `:where(.btn) { padding: 8px 16px; }` lets a consumer's `.btn { padding: 12px; }` win by source order/layer alone, since `:where()` contributes zero specificity regardless of the selector list inside it.
