# `z-index` Rules: Within vs. Across Stacking Contexts

This is the single most-tested concept in this topic, so it's worth stating as plainly as possible:

> **`z-index` values only ever compare directly against other elements that share the same stacking context.** Once an element belongs to a *child* stacking context, its `z-index` can only win or lose against its siblings *inside that same context* — it can never reach out and out-rank something in a completely different (e.g. parent or sibling) stacking context. When two different stacking contexts are compared, the *entire context* is treated as a single painted unit, ordered by the `z-index` (or paint order) of the element that *created* that context, in *its* parent's context.

## Painting order within a single stacking context (no nested contexts involved)

From back to front:

1. The stacking context's own background and borders
2. Descendants with negative `z-index` (more negative = further back), in tree order among ties
3. Non-positioned, in-flow, block-level descendants, in tree order
4. Non-positioned floated descendants
5. In-flow inline-level descendants
6. Descendants that establish their own stacking context with `z-index: 0` or `auto` (positioned elements, etc.) — treated as one unit each, in tree order among ties
7. Positioned descendants with a *positive* `z-index`, ordered by that `z-index` value (higher paints later/on top), tree order breaks ties

## The classic trap, worked in full

```html
<div class="parent-a">
  <div class="child-high">z-index: 9999</div>
</div>
<div class="parent-b">
  <div class="child-low">z-index: 1</div>
</div>
```

```css
.parent-a {
  position: relative;
  z-index: 1;      /* .parent-a establishes a stacking context, ranked "1" among its siblings */
  opacity: 0.99;    /* (or transform, or any other trigger — this alone would already do it) */
}
.child-high {
  position: relative;
  z-index: 9999;    /* huge number, but only meaningful *inside* .parent-a's stacking context */
}

.parent-b {
  position: relative;
  z-index: 2;       /* .parent-b's stacking context outranks .parent-a's (2 > 1) */
}
.child-low {
  position: relative;
  z-index: 1;        /* small number, but irrelevant here — the comparison never reaches this deep */
}
```

**Result: `.child-low` (z-index 1) paints on top of `.child-high` (z-index 9999).**

Why: `.child-high`'s `z-index: 9999` is only compared against other elements *inside* `.parent-a`'s stacking context — there are none, so it simply paints at the top of that context. But the comparison that actually determines final paint order is `.parent-a` (context rank `1`) vs. `.parent-b` (context rank `2`) — and `2 > 1`, so all of `.parent-b`'s content, including `.child-low`, paints above all of `.parent-a`'s content, no matter what `z-index` value is buried inside `.parent-a`. The `9999` never even enters the comparison — it's not competing in the same "race."

## The fix

There are three real fixes, and which one is right depends on intent:

1. **Raise `.parent-a`'s own `z-index`** (the stacking context that contains `.child-high`) above `.parent-b`'s, since that's the comparison that actually matters.
2. **Remove the accidental stacking-context trigger** on `.parent-a` (e.g. don't use `opacity`/`transform` there, or move it elsewhere) so `.child-high` participates directly in the parent context instead of being trapped in a new one.
3. **Move `.child-high` in the DOM** so it's no longer a descendant of the context-creating ancestor at all (common for modals — render them via a portal to `document.body` specifically to escape ancestor stacking contexts and `overflow` clipping at once).

## Rule of thumb for interviews

If someone says "I set `z-index: 99999` and it still won't go on top," the answer is almost always: *some ancestor of that element is itself capped by a lower-ranked (or context-less) stacking context, and no child `z-index` can escape its own parent's stacking context.* Trace up the DOM tree looking for `position` + non-auto `z-index`, `opacity < 1`, `transform`, `filter`, or `will-change` on any ancestor — that's the ceiling.
