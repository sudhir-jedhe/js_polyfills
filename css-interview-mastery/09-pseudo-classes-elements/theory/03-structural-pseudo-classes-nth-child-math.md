# Structural Pseudo-Classes and `nth-child` Math

Structural pseudo-classes match elements based on their *position among siblings*, with no class or attribute needed.

## The simple ones

```css
li:first-child { }  /* the element IS its parent's first child */
li:last-child { }   /* the element IS its parent's last child */
li:only-child { }   /* the element is the ONLY child of its parent */
p:empty { }          /* has no children at all, not even whitespace text nodes */
```

## `:nth-child(an + b)` — the formula

`:nth-child()` takes a formula `an + b` where `n` is `0, 1, 2, 3, ...`. For each value of `n`, the formula produces the 1-based index of a sibling to match.

```css
li:nth-child(2n)     /* a=2, b=0 → indices 2, 4, 6, 8...   (even) */
li:nth-child(2n+1)   /* a=2, b=1 → indices 1, 3, 5, 7...   (odd) */
li:nth-child(3n)     /* a=3, b=0 → indices 3, 6, 9, 12...  (every 3rd) */
li:nth-child(3n+1)   /* a=3, b=1 → indices 1, 4, 7, 10...  (every 3rd, starting at 1) */
li:nth-child(-n+3)   /* a=-1, b=3 → indices 3, 2, 1        (only the first 3, since index must be ≥1) */
li:nth-child(5)      /* no n term → just index 5 */
```

**How to compute it by hand:** plug in `n = 0, 1, 2, 3...` in order and stop once the result goes negative or you have enough terms.
For `-n+3`: n=0 → 3, n=1 → 2, n=2 → 1, n=3 → 0 (invalid, stop). So it matches children 1, 2, and 3 — a common pattern for "style only the first N items."

Keywords `even` and `odd` are shorthand for `2n` and `2n+1`.

## `:nth-child()` vs `:nth-of-type()`

This is the single most common trip-up in interviews. `:nth-child()` counts position among **all** sibling elements regardless of tag; `:nth-of-type()` counts position among siblings of the **same tag** only.

```html
<div>
  <h2>Title</h2>       <!-- child 1 overall, type-index 1 among h2s -->
  <p>First</p>          <!-- child 2 overall, type-index 1 among ps -->
  <p>Second</p>         <!-- child 3 overall, type-index 2 among ps -->
</div>
```

```css
p:nth-child(1)   /* matches NOTHING — child 1 is the h2, not a p */
p:nth-of-type(1) /* matches "First" — it's the 1st <p> among <p> siblings, ignoring the h2 */
p:nth-child(2)   /* matches "First" — it IS overall child #2, and it happens to be a p */
```

| Selector | Counts... | Common bug it causes |
|---|---|---|
| `:nth-child(n)` | Position among *all* sibling elements | Adding an unrelated sibling (e.g. a heading) shifts every match |
| `:nth-of-type(n)` | Position among siblings *of the same tag* | Less brittle for mixed-content containers, but ignores overall document order |

**Rule of thumb:** use `:nth-of-type()` when siblings are a mix of tags and you only care about one tag's own sequence (e.g. "every other paragraph"); use `:nth-child()` when you want true positional styling within the whole set (e.g. zebra-striping table rows, which are all `<tr>` anyway so the two are equivalent there).

## `:nth-last-child()` and `:nth-last-of-type()`

Same formulas, but counted from the *end* of the sibling list instead of the start — useful for "style the last 3 items" without knowing the total count: `li:nth-last-child(-n+3)`.
