# Output: `flex-wrap` Line-Breaking Behavior

```css
.row { display: flex; flex-wrap: wrap; width: 500px; }
.item { flex: 0 0 200px; } /* fixed 200px, no grow, no shrink */
```
```html
<div class="row">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
</div>
```

**Question:** How do the three items distribute across lines, and how much empty space is left on each line?

**Answer:** A and B share the first line; C wraps to a second line alone. First line has `100px` of empty space (unfilled, since `justify-content` defaults to `flex-start`); second line has `300px` of empty space.

**Why:** each item has a fixed `200px` basis with `flex-grow: 0` and `flex-shrink: 0`, so items never resize to fit — they either fit on the current line or wrap. Line 1: A (`200px`) + B (`200px`) = `400px`, which fits within the `500px` container (`400 ≤ 500`). Adding C would make it `600px`, which exceeds `500px`, so C wraps to a new line instead of forcing a shrink (shrinking is disabled by `flex-shrink: 0`). With default `justify-content: flex-start`, unfilled space on each line sits at the end, unused — line 1 has `500 - 400 = 100px` left over, line 2 has `500 - 200 = 300px` left over. Neither line's items resize to consume that leftover space, since `flex-grow: 0` on every item means nothing is eligible to grow into it.
