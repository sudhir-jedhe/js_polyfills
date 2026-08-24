# `grid-template-columns`/`rows` and the `fr` Unit

Setting `display: grid` on an element makes it a grid container; `grid-template-columns` and `grid-template-rows` define the explicit column/row tracks.

## Fixed and mixed-unit tracks

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 100px; /* fixed sidebar, flexible middle, fixed rail */
  grid-template-rows: 80px auto 60px;      /* fixed header, content sized to itself, fixed footer */
}
```

## The `fr` unit

`fr` ("fraction") distributes the container's **remaining space** (after all fixed/content-based tracks are sized) proportionally among tracks that use it — conceptually similar to `flex-grow`, but operating on grid tracks instead of flex items.

```css
.grid { grid-template-columns: 1fr 2fr 1fr; } /* 3 flexible tracks, ratio 1:2:1 of whatever space remains */
```
If the container is `800px` wide, this gives `200px 400px 200px` (the `1+2+1=4` shares split `800px` proportionally).

## `repeat()`

```css
grid-template-columns: repeat(4, 1fr); /* shorthand for 1fr 1fr 1fr 1fr */
grid-template-columns: repeat(3, minmax(150px, 1fr)); /* 3 tracks, each at least 150px, flexible above that */
```

## The `fr` gotcha: an `fr` track's minimum size defaults to `auto` (min-content), not zero

This is the `fr`-unit equivalent of the `flex-shrink` trap: a `1fr` track will **not** shrink below its content's minimum size (`min-content`) just because the container is narrow — it can overflow the grid instead of shrinking to fit, which surprises people expecting `fr` to behave like a percentage that always fits:

```css
.grid { grid-template-columns: 1fr 1fr; }
```
```html
<div class="grid">
  <div>A very long unbreakable string like a URL that cannot wrap</div>
  <div>Short</div>
</div>
```
If the first item's content can't wrap below some width, that `1fr` track will grow to accommodate it — potentially overflowing the grid container — rather than truncating or shrinking past that point. The fix is the same trick used for flex items:
```css
.grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } /* explicit 0 minimum overrides the automatic min-content floor */
```
`minmax(0, 1fr)` is common enough in real codebases that it's worth recognizing on sight — it means "flexible track, but allow it to shrink all the way down, even below its content's natural minimum size" (typically paired with `overflow: hidden`/text-ellipsis on the content inside, so it degrades gracefully instead of just clipping raw).

## `minmax()`

```css
grid-template-columns: minmax(200px, 1fr) minmax(150px, 300px);
```
`minmax(min, max)` clamps a track between a floor and a ceiling. If `min` exceeds `max`, the `max` is ignored and the track behaves as if sized to `min` alone.
