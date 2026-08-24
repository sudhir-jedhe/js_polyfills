# `content-box` vs. `border-box`

`box-sizing` controls what the `width`/`height` properties actually measure.

## `content-box` (the default)

`width`/`height` size the content area only; padding and border are added on top, growing the element's total rendered size beyond what you declared:

```css
.box { box-sizing: content-box; width: 200px; padding: 20px; border: 5px solid; }
/* rendered width = 200 + 20+20 + 5+5 = 250px */
```

## `border-box`

`width`/`height` size the content + padding + border **together** — the content area shrinks to accommodate padding/border, and the element's total rendered size is exactly what you declared:

```css
.box { box-sizing: border-box; width: 200px; padding: 20px; border: 5px solid; }
/* rendered width = 200px, content area shrinks to 200 - 20-20 - 5-5 = 150px */
```

## Side-by-side

| | `content-box` | `border-box` |
|---|---|---|
| `width`/`height` measure | content only | content + padding + border |
| Adding padding/border | grows the total box | shrinks available content space, total box unchanged |
| Nesting percentage widths | error-prone (child `width: 100%` + any padding overflows the parent) | predictable (`width: 100%` + padding never overflows) |
| Default | yes | no — must be opted into |

## The near-universal reset

Because `content-box` math makes percentage-based and responsive layouts unpredictable (a `width: 50%` child with `padding: 20px` can overflow its parent), almost every real-world project resets every element to `border-box` globally:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Using `*` (rather than `html { box-sizing: border-box }` plus inheritance tricks) is the simplest correct version — some older guides recommend setting it on `html` and inheriting it so component authors can locally opt individual elements back into `content-box` via `box-sizing: inherit`, but for the vast majority of projects the flat universal reset above is sufficient and is what you'll see in nearly every modern CSS reset (including browsers' own recommended baseline).
