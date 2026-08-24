# BEM as a Specificity-Avoidance Strategy

BEM (**B**lock **E**lement **M**odifier) is a naming convention, but its real engineering value is that it's a *deliberate strategy to keep every selector at the same, flat specificity* — one class, always `(0,1,0)` — so the cascade never has to arbitrate ID-vs-nesting fights.

## The naming pattern

```css
.card { }                 /* Block: a standalone, reusable component */
.card__title { }          /* Element: a part of that block, joined with __ */
.card__title--large { }   /* Modifier: a variation, joined with -- */
.card--featured { }       /* Modifier on the block itself */
```

```html
<div class="card card--featured">
  <h2 class="card__title card__title--large">Headline</h2>
</div>
```

Every single BEM class selector has identical specificity: `(0,1,0)`. There is never a `.card .title` (descendant, specificity `(0,2,0)`) or `#card .title` (`(1,1,0)`) to out-rank or be out-ranked by something else — the flatness is the point, not a side effect.

## Why flat specificity matters at scale

| Approach | Example | Specificity | Problem at scale |
|---|---|---|---|
| Deep nesting | `.page .sidebar .widget .title` | (0,4,0) | Grows every time markup gets nested one level deeper; a later 1-class override needs `!important` or matching depth |
| ID selectors | `#widget-title` | (1,0,0) | Effectively un-overridable by any class combination; forces the next dev to also reach for an ID or `!important` |
| BEM | `.widget__title` | (0,1,0) | Constant, regardless of where the element sits in the DOM |

Because every BEM selector has the same weight, the **only** thing that decides which rule wins between two BEM class rules is **source order** — which is exactly the property you want: predictable, and controllable just by where you place a `<link>` or where a rule appears in the file.

## BEM doesn't eliminate the cascade — it tames it

BEM doesn't remove specificity or the cascade; it just refuses to *use* specificity as a design tool. Combined with `@layer` (e.g. `@layer components` for all BEM component CSS, `@layer utilities` declared after it for one-off overrides), you get a system where priority is 100% explicit: layer order between layers, source order within a layer, and specificity almost never has to be reasoned about at all.
