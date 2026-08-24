# Interview Q&A — Color & Modern Color Spaces

**Q: What does `color-mix(in srgb, red 30%, blue)` actually compute?**
It blends 30% red with 70% blue (the remainder, since only one percentage was given), interpolating each color channel linearly in the sRGB color space. The result is a specific blended color — a purple leaning toward blue, given the 70/30 weighting.

**Q: Why might `color-mix(in oklch, ...)` produce a visually different (often nicer) result than `color-mix(in srgb, ...)` for the same two input colors and ratio?**
sRGB interpolation happens per-channel (R, G, B independently) in a way that isn't perceptually uniform — mixing colors far apart on the color wheel (like red and green) tends to produce a muddy, desaturated midpoint. `oklch` is a perceptually-uniform color model, so interpolating within it tends to produce a midpoint that looks like a genuinely "in-between" color to the human eye, rather than a washed-out compromise.

**Q: What's the practical advantage of authoring a color scale in `oklch()` instead of hex/RGB?**
`oklch()` separates lightness into its own independent channel, so adjusting just the lightness value produces a predictable, perceptually-even progression of shades. Doing the equivalent in hex/RGB requires non-linear math across three coupled channels to avoid an uneven-looking scale — `oklch` makes "give me a 20% darker version of this exact color" a simple, direct operation.

**Q: Is `oklch()`/`lab()` support universal? How would you handle a browser that doesn't support them?**
Support is broad across current major browsers but not universal across all still-in-use browser versions. A safe fallback pattern is declaring the property twice — a hex/rgb fallback value first, followed by the `oklch()`/`lab()` value — since a CSS engine that doesn't recognize a color function treats that whole declaration as invalid and ignores it, silently keeping the earlier, supported value in browsers that don't understand the newer syntax.

**Q: Beyond mixing, what's a color-space advantage relevant to modern displays?**
`oklch` and `lab` can express colors outside the sRGB gamut (e.g. reaching into the wider P3 gamut supported by many modern displays), whereas hex/RGB values are fundamentally capped to what sRGB can represent — meaning richer, more saturated colors are achievable on capable hardware when authored in a wide-gamut-capable color space.
