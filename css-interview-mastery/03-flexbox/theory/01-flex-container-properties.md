# Flex Container Properties

Setting `display: flex` (or `inline-flex`) on an element turns it into a **flex container**, and every one of its direct children automatically becomes a **flex item** — no property needs to be set on the children to opt them in.

## `flex-direction`

Sets the main axis:

```css
.container { flex-direction: row; }            /* default: main axis left→right (LTR) */
.container { flex-direction: row-reverse; }     /* main axis right→left */
.container { flex-direction: column; }          /* main axis top→bottom */
.container { flex-direction: column-reverse; }  /* main axis bottom→top */
```

## `flex-wrap`

```css
.container { flex-wrap: nowrap; }    /* default: all items forced onto one line, shrinking as needed */
.container { flex-wrap: wrap; }      /* items overflow onto new lines instead of shrinking indefinitely */
.container { flex-wrap: wrap-reverse; } /* wraps, but stacks new lines in the opposite cross-axis direction */
```
`flex-flow` is the shorthand for `flex-direction` + `flex-wrap`: `flex-flow: row wrap;`.

## `justify-content` — alignment along the main axis

```css
justify-content: flex-start;    /* default: items packed at the start */
justify-content: flex-end;      /* items packed at the end */
justify-content: center;        /* items centered */
justify-content: space-between; /* equal space BETWEEN items, none at the outer edges */
justify-content: space-around;  /* equal space around EACH item (edges get half the space of between-item gaps) */
justify-content: space-evenly;  /* equal space between items AND at the outer edges */
```

## `align-items` — alignment along the cross axis, single line

```css
align-items: stretch;     /* default: items stretch to fill the container's cross-axis size, if they have no explicit cross-size */
align-items: flex-start;  /* items align to the cross-axis start */
align-items: flex-end;    /* items align to the cross-axis end */
align-items: center;      /* items centered on the cross axis */
align-items: baseline;    /* items aligned so their text baselines line up */
```

## `align-content` — alignment of multiple lines, only relevant with `flex-wrap: wrap` and extra cross-axis space

```css
align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```
`align-content` does nothing on a single-line flex container (`flex-wrap: nowrap`, or a wrapped container whose lines exactly fill the cross axis) — it's easy to set this expecting an effect and see nothing change, because it only has an effect when there are multiple flex lines *and* leftover cross-axis space to distribute between them.

## `gap`, `row-gap`, `column-gap`

```css
.container { gap: 16px; }             /* both row and column gap */
.container { row-gap: 8px; column-gap: 16px; } /* independently */
```
`gap` inserts space **only between** items — never before the first or after the last — which is why it replaced the older `margin`-based spacing hacks (see the box-model-layout topic's `calc()` scenario for the arithmetic `gap` avoids).
