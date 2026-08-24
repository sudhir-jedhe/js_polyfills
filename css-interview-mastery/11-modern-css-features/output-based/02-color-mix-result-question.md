# What Color Does This `color-mix()` Produce?

```css
:root { --brand: #2563eb; }

.a { background: color-mix(in srgb, var(--brand) 100%, white); }
.b { background: color-mix(in srgb, var(--brand) 0%, white); }
.c { background: color-mix(in srgb, var(--brand) 50%, white); }
```

**Question:** What does each rule render as?

**Answer:**
- `.a` renders as plain `--brand` (`#2563eb`) — 100% of the first color means none of the second color is mixed in at all.
- `.b` renders as plain `white` — 0% of `--brand` means the result is entirely the second color.
- `.c` renders as a 50/50 blend of `#2563eb` and `white`, interpolated in the `srgb` color space — a lighter, somewhat pastel blue, but NOT necessarily the "visually halfway" point between the two, since sRGB interpolation is linear per-channel and not perceptually uniform.

**Why:** `color-mix(in <space>, color1 P1%, color2 P2%)` blends the two colors proportionally to the given percentages, within the specified interpolation color space. When only one percentage is given, the other is inferred as the remainder needed to reach 100%. The interpolation space (`srgb` here) determines *how* the midpoint is computed — mixing the same two colors `in oklch` instead would produce a different-looking (typically more perceptually "even") result at the same 50% ratio, even though the two input colors and percentages are identical.
