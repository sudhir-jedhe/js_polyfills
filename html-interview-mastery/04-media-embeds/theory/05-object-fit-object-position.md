# `object-fit` and `object-position`: HTML + CSS Interplay

## The problem: replaced elements and intrinsic aspect ratio

`<img>`, `<video>`, and similar **replaced elements** carry their own intrinsic size/aspect ratio (from the actual media file), which doesn't automatically match whatever box you lay them out into via CSS. Setting `width`/`height` on an `<img>` to a size with a different aspect ratio than the source file causes visible **squishing/stretching distortion** by default — this is exactly the problem `object-fit` solves, analogous to what `background-size` does for CSS background images, but for actual replaced content.

## `object-fit` values

```css
img, video {
  width: 300px;
  height: 300px;   /* a square box, but the source media likely isn't square */
  object-fit: cover;
}
```

| Value | Behavior |
|---|---|
| `fill` (default) | Stretches to fill the box exactly, ignoring aspect ratio — causes distortion unless the box happens to match the source aspect ratio |
| `contain` | Scales to fit entirely within the box, preserving aspect ratio — may leave empty space (letterboxing/pillarboxing) on one axis |
| `cover` | Scales to fill the box entirely, preserving aspect ratio — crops whatever overflows on one axis; the most common choice for photo grids/thumbnails |
| `none` | No resizing at all — renders at intrinsic size, cropped or with empty space per the box dimensions |
| `scale-down` | Behaves like `none` or `contain`, whichever results in a smaller rendered size |

## `object-position`

Controls *which part* of the source media is kept/anchored when `cover` crops content (or where `contain`'s content sits within any leftover space) — same syntax as `background-position`:

```css
img {
  object-fit: cover;
  object-position: top center; /* keep the top of the image visible, e.g. for portraits where cropping the bottom is safer than cropping the top */
}
```

```css
/* percentage or keyword values both work */
img { object-position: 50% 20%; } /* biased toward the top */
```

## Why this is genuinely an HTML+CSS interplay topic

`object-fit`/`object-position` are CSS properties, but they only have meaning on **replaced elements** — applying them to a `<div>` does nothing, because a `<div>`'s content isn't a "replaced" external resource the way an image/video file is. This makes the topic sit right at the boundary: which HTML elements are even eligible for these properties is an HTML content-model fact, while the actual cropping/fitting behavior is pure CSS.

## Comparison: `object-fit: cover` vs. `background-image` + `background-size: cover`

| | `<img>` + `object-fit: cover` | `background-image` + `background-size: cover` |
|---|---|---|
| Semantic/accessible | Yes — real `<img>` with `alt` text, part of the accessibility tree | No — decorative only; screen readers get no content from a CSS background image |
| SEO | Indexable as real image content | Not typically indexed as content |
| Lazy-loading / `srcset` support | Yes — full native `loading`/`srcset` support | No native lazy-loading equivalent; requires a CSS class toggle via JS |
| Use case | Any image that's actual *content* (a product photo, an article's illustrative image) | Purely decorative background treatments with no informational content |

**The practical rule:** if the image conveys real information, use `<img>` (with `object-fit` for cropping control) — not a CSS background — precisely because of the accessibility and SEO gap in the table above. Reach for a CSS background image only for genuinely decorative visuals with no content value on their own.
