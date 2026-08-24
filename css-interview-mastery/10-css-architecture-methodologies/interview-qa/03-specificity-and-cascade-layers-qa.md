# Interview Q&A — Specificity & Cascade Layers

**Q: How does `@layer` change the order in which the browser resolves conflicting rules?**
Normally the browser compares specificity first, and only falls back to source order when specificity ties. With `@layer`, layer declaration order is checked *before* specificity — a rule in a later-declared layer always beats a rule in an earlier-declared layer, regardless of how much higher the earlier layer's specificity is. Specificity/source-order comparison only happens for rules within the same layer (or among unlayered rules).

**Q: What happens when unlayered CSS conflicts with CSS inside a named `@layer`?**
Unlayered CSS always wins. Any CSS not inside an `@layer` block is treated as belonging to an implicit final layer that comes after every named layer, so it outranks all layered styles regardless of specificity. This is what makes incremental `@layer` adoption safe — existing (unlayered) legacy CSS keeps behaving exactly as before, even as new code starts using layers.

**Q: Is there any case where `!important` reverses the normal layer-priority order?**
Yes — for `!important` declarations specifically, layer priority is reversed: an `!important` rule in an *earlier*-declared layer beats an `!important` rule in a later-declared layer. And unlayered `!important` rules have the *lowest* priority among `!important` declarations (the opposite of the normal, non-important behavior where unlayered always wins). This is a deliberate spec design so that foundational/reset layers can use `!important` to enforce truly non-negotiable rules that later, more specific layers can't accidentally override.

**Q: What's ITCSS, and how does `@layer` relate to it?**
ITCSS is a convention for ordering stylesheet imports from generic (resets, element defaults) to explicit (components, utilities), so that specificity/priority naturally increases through the source without needing selector-level specificity fights. `@layer` is a native browser feature that can implement the same generic-to-explicit ordering concept, but with a hard guarantee (layer order beats specificity entirely) instead of relying on developers keeping selectors consistently low-specificity throughout.

**Q: Why should ID selectors generally be avoided for styling in a codebase using any of these methodologies?**
Because an ID selector's specificity (1,0,0) outweighs any realistic number of class selectors, making ID-selected rules very difficult to override with normal class-based CSS — a single legacy `#header { ... }` rule can defeat an entire well-organized BEM/utility system without `@layer` or `!important`. IDs are best reserved for JS hooks, fragment anchors, or `aria-*`/`for` relationships, not as CSS styling selectors.
