# Specificity Management at Scale

A single specificity conflict is trivial to fix. The real problem interviews are probing for is: what happens when a codebase has *thousands* of selectors written by dozens of people over several years, and specificity has crept upward everywhere as a side effect of firefighting individual bugs.

## How specificity wars start

1. Someone writes `.card .title { color: #333; }` (nested, specificity 0,2,0) because it "felt natural" given the markup nesting.
2. Someone else needs a different title color in one place, and rather than restructuring, adds `.sidebar .card .title { color: red; }` (0,3,0) to win.
3. A third person needs to override *that*, and reaches for `!important` because raising specificity further feels excessive.
4. Now the only way to override the `!important` rule is another `!important` with higher source-order priority, or an inline style — the stylesheet has become effectively unmaintainable in that area.

## Strategies to prevent/reverse this

| Strategy | What it does |
|---|---|
| **Flat, single-class selectors (BEM)** | Keeps every rule at the same specificity tier (0,1,0), so nothing "wins" by nesting more deeply — conflicts get resolved by source order or explicit modifier classes instead |
| **`:where()` for shared/base styles** | Contributes zero specificity, so base/reset rules never need to be "beaten" by component-level classes |
| **ITCSS-style layer ordering** | Organizes source order so specificity *naturally* increases from generic (resets) to specific (utilities), instead of being fought rule-by-rule |
| **Native `@layer` cascade layers** | Lets you explicitly declare layer precedence independent of specificity or source order — a low-specificity rule in a later layer can still lose to an earlier layer deliberately |
| **Avoiding ID selectors and inline styles for styling hooks** | IDs (1,0,0) and inline styles are specificity outliers that are hard to override with normal class-based rules; reserve IDs for JS hooks/anchors, not CSS |
| **Linting specificity/selector depth** | Tools like stylelint can enforce a max selector depth or flag `!important`, catching creep before it merges |

## The core principle

Specificity itself isn't the enemy — *inconsistent* specificity is. A codebase where every component rule is deliberately kept at the same specificity tier is trivially predictable: the last rule in source order wins, always. A codebase with wildly varying specificity requires you to compute and compare specificity for every override, which doesn't scale past a small number of contributors. This is precisely the problem ITCSS and cascade layers (next two files) solve more formally.
