# `color-mix()` and Modern Color Spaces (`oklch`, `lab`)

## `color-mix()`

Mixes two colors together, in a specified color space, at a specified ratio — natively, with no Sass function or JS color library needed.

```css
.btn {
  background: color-mix(in srgb, #2563eb 70%, white);
  /* 70% of the blue, 30% white, mixed in the sRGB space */
}

.btn:hover {
  background: color-mix(in srgb, #2563eb 85%, black);
  /* a quick "darken by mixing in black" hover state, no separate hardcoded hover color needed */
}
```

The percentage is optional for one argument (it's inferred as the remainder): `color-mix(in srgb, blue 30%, red)` mixes 30% blue with 70% red.

## Why the color space argument matters

`color-mix(in srgb, ...)` interpolates in sRGB, which can produce muddy, desaturated-looking midpoints for colors far apart on the color wheel (a classic problem: mixing red and green in sRGB tends toward a drab brown/gray, not a vivid color). Mixing `in oklch` (or `in lch`) instead interpolates using a perceptually-uniform color model, which tends to produce more visually pleasing, evenly-transitioning midpoints:

```css
color-mix(in srgb, red 50%, green);   /* muddy brownish result */
color-mix(in oklch, red 50%, green);  /* a more vivid, perceptually "in-between" result */
```

## `oklch()` and `lab()` as color functions

Beyond mixing, you can author colors directly in these modern spaces:

```css
.brand { color: oklch(0.6 0.15 250); }   /* lightness, chroma, hue — hue in degrees */
.brand-alt { color: lab(60% 20 -40); }    /* lightness, a-axis, b-axis */
```

| Aspect | `sRGB` / hex (`#2563eb`) | `oklch()` | `lab()` |
|---|---|---|---|
| Perceptually uniform? | No — equal numeric steps don't look like equal visual steps | Yes | Yes |
| Easy to generate a lighter/darker shade predictably? | Not really — adjusting RGB channels doesn't map cleanly to perceived lightness | Yes — adjust the lightness channel directly | Yes — adjust the lightness channel directly |
| Gamut | Limited to sRGB | Can express a wider gamut (P3 and beyond), better matches modern wide-gamut displays | Also wide-gamut capable |
| Browser support | Universal | Broad in current major browsers | Broad in current major browsers |
| Typical use | Legacy/simple color values | Design systems needing predictable lightness/contrast steps, gradients that don't look muddy | Similar use case to oklch, less commonly used in practice than oklch |

## Why this matters for design systems

Generating an accessible color scale (e.g. 10 shades of a brand color for a Tailwind-style palette) is much more predictable in `oklch` than in hex/RGB, because adjusting just the lightness channel produces a visually even progression — doing the equivalent in RGB requires non-linear channel math to avoid uneven-looking steps. This is part of why modern design tokens increasingly define colors in `oklch` even when a hex fallback is also shipped for older browsers.
