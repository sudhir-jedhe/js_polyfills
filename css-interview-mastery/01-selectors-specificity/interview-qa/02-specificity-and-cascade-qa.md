# Interview Q&A — Specificity and the Cascade

**Q: Walk through how specificity is calculated.**
Specificity is a tuple compared left to right across four "columns": inline styles, ID selectors, class/attribute/pseudo-class selectors, and type/pseudo-element selectors. You count how many selectors of each kind appear in a given compound selector, then compare two competing selectors column by column starting from the most powerful (inline, then ID) — the first column where one selector has a strictly higher count wins outright; you never sum columns into a single combined number.

**Q: Does `!important` change a rule's specificity?**
No. `!important` doesn't touch the selector's specificity value at all — it promotes the *declaration* into a higher-priority tier of the overall cascade, which is evaluated before specificity comes into play. Two competing `!important` declarations still fall back to specificity (and then source order) to break their tie.

**Q: If two selectors have identical specificity, what decides the winner?**
Source order — whichever rule appears later in the stylesheet (or in a later `<link>`/`<style>` in the document) wins. This is why load order matters even when specificity is a non-factor.

**Q: How do cascade layers (`@layer`) interact with specificity?**
For normal (non-`!important`) declarations, layer order is compared *before* specificity — a rule in a layer declared later always beats a rule in a layer declared earlier, regardless of how much higher the earlier layer's specificity is. Specificity only breaks ties *within* the same layer. Unlayered CSS is treated as an implicit final layer and beats every named layer.

**Q: Does that mean unlayered CSS always wins?**
For normal declarations, yes — unlayered author CSS has the highest priority among normal author declarations. But for `!important` declarations, it's the opposite: unlayered `!important` has the *lowest* priority, and layer order itself reverses (earlier-declared layers win for `!important`). This asymmetry is intentional, so that low-level layers like a reset can use `!important` to enforce baseline rules nothing else can override.

**Q: True or false: inheritance can be overridden by specificity.**
This is a bit of a trick question — inheritance isn't "outranked" by specificity at all; it's simply what happens when *no* declaration explicitly sets a property on an element. The moment any rule, no matter how weak (even the universal selector `*`), explicitly sets that property, the element uses that value instead of inheriting — specificity is never even consulted in that comparison, because there's no competing explicit declaration to compare against.
