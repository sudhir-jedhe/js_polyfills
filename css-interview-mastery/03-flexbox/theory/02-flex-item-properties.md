# Flex Item Properties

These are set on the **children** of a flex container, not the container itself.

## `flex-grow`, `flex-shrink`, `flex-basis`

```css
.item {
  flex-grow: 0;    /* default: 0 — don't grow to consume extra space */
  flex-shrink: 1;  /* default: 1 — DO shrink if there's not enough space */
  flex-basis: auto; /* default: auto — use the item's width (or content size) as its starting main-size */
}
```

See the dedicated `flex-grow-shrink-basis-math` theory file for the full distribution algorithm — this file covers what each property *means* in isolation.

- **`flex-grow`**: a unitless number representing the item's *share* of any positive leftover space along the main axis, relative to the sum of every item's `flex-grow` in the same line. `0` means "never grow beyond its basis."
- **`flex-shrink`**: a unitless number representing the item's willingness to shrink when items collectively overflow the container. Also relative, but — critically — the shrink *ratio* is itself weighted by each item's `flex-basis`, not applied as a flat share (this is the single most common flexbox interview trap).
- **`flex-basis`**: the item's starting main-size, before growing/shrinking is applied. Can be a length (`200px`), a percentage, `auto` (fall back to the `width`/`height` property, or content size if unset), or `content` (explicitly size to content, ignoring `width`/`height`).

## The `flex` shorthand

```css
flex: <grow> <shrink> <basis>;
```

| Shorthand | Expands to | Common use |
|---|---|---|
| `flex: 1;` | `1 1 0%` | Equal-width flexible items, ignoring content size as a starting point |
| `flex: auto;` | `1 1 auto` | Grow/shrink freely, but start from the item's natural/content size |
| `flex: none;` | `0 0 auto` | Fixed size — never grows, never shrinks |
| `flex: 2;` | `2 1 0%` | Grows twice as fast as a sibling with `flex: 1`, from a zero starting basis |
| `flex: 0 0 200px;` | explicit | A fixed 200px item that neither grows nor shrinks — common for a sidebar |

`flex: 1` vs. `flex: auto` is a frequent point of confusion: both grow and shrink freely, but `flex: 1` starts every item's basis at `0%` (so final sizes are driven almost entirely by the grow ratio, ignoring content length), while `flex: auto` starts from the item's actual content/width size (so items with more content start larger, and grow/shrink from there).

## `align-self`

Overrides the container's `align-items` for a single item:

```css
.item--pinned-bottom { align-self: flex-end; } /* this one item aligns to the cross-axis end, others follow align-items */
```

## `order`

Changes visual/paint order without touching the DOM/source order (source order is still what screen readers and tab-navigation follow, which is why `order` should be used for cosmetic reflow only, not to fix genuinely wrong DOM order):

```css
.item--first-on-mobile { order: -1; } /* default order is 0; lower numbers render earlier */
```
