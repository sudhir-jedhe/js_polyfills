# Problem: Rank Selectors by Specificity

## Problem Statement

Given the following list of selectors, compute each one's specificity as an `(id, class, type)` triple and sort them from **highest to lowest** priority. Assume none of them are inline styles or use `!important`.

```css
1. .nav .nav__item.is-active
2. #main-nav a
3. nav ul li a
4. [data-nav="primary"] a::after
5. .nav__item
6. #main-nav .nav__item.is-active
7. :where(#main-nav) .nav__item
8. * .nav__item
```

## Constraints

- Show the `(id, class, type)` triple for each selector.
- Sort highest → lowest priority; note any ties and how they'd actually resolve (source order).
- Remember: combinators and `*` contribute nothing; attribute selectors count as class-weight; `:where()` always contributes zero regardless of its argument.

## Solution

| # | Selector | (id, class, type) |
|---|---|---|
| 6 | `#main-nav .nav__item.is-active` | (1, 2, 0) |
| 2 | `#main-nav a` | (1, 0, 1) |
| 1 | `.nav .nav__item.is-active` | (0, 3, 0) |
| 4 | `[data-nav="primary"] a::after` | (0, 1, 2) |
| 5 / 7 / 8 | `.nav__item`, `:where(#main-nav) .nav__item`, `* .nav__item` | (0, 1, 0) — **tied three ways** |
| 3 | `nav ul li a` | (0, 0, 4) |

**Ranked highest → lowest:**

1. `#main-nav .nav__item.is-active` — (1,2,0): two IDs' worth of... no, one ID (id:1) already beats everything below it.
2. `#main-nav a` — (1,0,1): still has an ID, beats everything without one, even though its class column is 0.
3. `.nav .nav__item.is-active` — (0,3,0): no ID, but three classes beats anything with fewer classes and no ID.
4. `[data-nav="primary"] a::after` — (0,1,2): one class-weight beats the 0-class-weight group below it, and its type count doesn't matter yet since the class column already decided it.
5. `.nav__item`, `:where(#main-nav) .nav__item`, `* .nav__item` — all exactly (0,1,0), a **three-way tie**. `:where()` contributes zero regardless of the `#main-nav` inside it, and `*` contributes zero too — so despite looking very different, these three selectors are functionally identical in weight. If all three matched the same element, the one appearing **last in source order** (as written, #8) would win.
6. `nav ul li a` — (0,0,4): the lowest, since it has no ID or class contribution at all — four type selectors still lose to a single class selector.

**Key takeaway:** selector *length* and visual complexity are not a proxy for specificity — `[data-nav="primary"] a::after` (short) outranks `nav ul li a` (also short, but zero class-weight), and `:where(#main-nav) .nav__item` looks like it should be powerful (there's an ID right there!) but is exactly as weak as a bare `.nav__item`.
