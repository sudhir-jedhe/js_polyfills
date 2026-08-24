# Main Axis vs. Cross Axis

Flexbox is fundamentally organized around two perpendicular axes, and almost every flexbox property is defined *relative to one of them* rather than in absolute "horizontal"/"vertical" terms — which is precisely why the same `justify-content: center` can center items horizontally or vertically depending on `flex-direction`.

## The main axis is whatever `flex-direction` points along

| `flex-direction` | Main axis direction | Cross axis direction |
|---|---|---|
| `row` (default) | left → right (horizontal) | top → bottom (vertical) |
| `row-reverse` | right → left (horizontal) | top → bottom (vertical) |
| `column` | top → bottom (vertical) | left → right (horizontal) |
| `column-reverse` | bottom → top (vertical) | left → right (horizontal) |

## Properties map to axes, not to "horizontal"/"vertical"

- **`justify-content`** always aligns along the **main** axis.
- **`align-items`** / **`align-self`** / **`align-content`** always align along the **cross** axis.
- **`flex-basis`**/`flex-grow`/`flex-shrink` always size along the **main** axis.
- An item's cross-axis size (when not explicitly set) defaults to `stretch` under `align-items`, filling the container's cross-axis size.

This means switching `flex-direction: row` to `flex-direction: column` doesn't just visually rotate the layout — it swaps *which* properties control which visual dimension. A `justify-content: center` that horizontally centered items in `row` mode will *vertically* center them once you switch to `column`, with zero other code changes, because `justify-content` never stopped meaning "align along the main axis" — only the main axis itself moved.

```css
.container {
  display: flex;
  flex-direction: column; /* main axis is now vertical */
  justify-content: center; /* centers items VERTICALLY now */
  align-items: center;     /* centers items HORIZONTALLY now (cross axis) */
}
```
This exact pattern (`flex-direction: column` + both alignments set to `center`, or the row equivalent) is the single most common flexbox recipe for centering *anything*, in either dimension, without `calc()` or `position: absolute` tricks.
