# The `flex-grow`/`flex-shrink`/`flex-basis` Algorithm, Worked in Full

This is the part of flexbox that separates "I've used flexbox" from "I understand flexbox," and it's a near-guaranteed interview question. The browser resolves each flex item's final main-size in three steps.

## Step 1: compute each item's flex-basis (its starting main-size)

If `flex-basis` is a length/percent, use it directly. If `auto`, fall back to the item's `width` (in `row` mode) or `height` (in `column` mode); if that's also unset, fall back to the item's content size.

## Step 2: compare the sum of all bases to the container's main size

- If the sum of bases is **less** than the container size → there's positive free space → distribute it via **`flex-grow`**.
- If the sum of bases is **greater** than the container size → items overflow → remove the excess via **`flex-shrink`**.
- If equal → nothing to distribute; every item renders exactly at its basis.

## Growing: proportional to `flex-grow` alone

```
item's growth share = (item's flex-grow / sum of flex-grow of all items) × free space
final size = flex-basis + growth share
```

**Worked example:** container is `900px`. Three items, each `flex-basis: 100px`, with `flex-grow` of `1`, `2`, and `1` respectively.
- Sum of bases = `300px`. Free space = `900 - 300 = 600px`. Sum of grow = `4`.
- Item A: `600 × (1/4) = 150` → final `100 + 150 = 250px`
- Item B: `600 × (2/4) = 300` → final `100 + 300 = 400px`
- Item C: `600 × (1/4) = 150` → final `100 + 150 = 250px`
- Check: `250 + 400 + 250 = 900px`. ✓

## Shrinking: proportional to `flex-shrink` × `flex-basis` — NOT `flex-shrink` alone

This is the trap. The browser computes a **scaled shrink factor** per item (`flex-shrink × flex-basis`), and distributes the overflow proportionally to *that*, not to the raw `flex-shrink` values.

```
item's scaled shrink factor = item's flex-shrink × item's flex-basis
item's shrink share = (item's scaled shrink factor / sum of all scaled shrink factors) × overflow amount
final size = flex-basis − shrink share
```

**Worked example:** container is `500px`. Three items, all `flex-basis: 200px` (sum `600px`, overflow `100px`), `flex-shrink` of `1`, `1`, and `2` respectively.
- Scaled shrink factors: A = `1×200=200`, B = `1×200=200`, C = `2×200=400`. Sum = `800`.
- A shrinks by `100 × (200/800) = 25px` → final `200 - 25 = 175px`
- B shrinks by `100 × (200/800) = 25px` → final `175px`
- C shrinks by `100 × (400/800) = 50px` → final `200 - 50 = 150px`
- Check: `175 + 175 + 150 = 500px`. ✓

**Why this trips people up:** intuitively you might expect item C (with `flex-shrink: 2`, "twice as willing to shrink") to shrink exactly *twice as much* as A and B. It does shrink twice as much *here* only because all three items happen to share the same `flex-basis` (200px) — if their bases differed, the ratio would skew further, because the shrink factor is `shrink × basis`, meaning a large item with a small `flex-shrink` can still lose more absolute pixels than a small item with a large `flex-shrink`. `flex-shrink` alone is never a reliable predictor of the outcome — you always have to factor in each item's basis.

## `min-width`/`max-width` (or `min-height`/`max-height` in column mode) clamp the result

After growing/shrinking, the browser clamps each item's final size to its `min-width`/`max-width`. If an item hits its `min-width` floor before absorbing its full calculated shrink share, the remaining shrink is redistributed among the other items in a second pass — this is why a `min-width` on one flex item can make its siblings shrink *more* than the simple single-pass formula above would predict.
