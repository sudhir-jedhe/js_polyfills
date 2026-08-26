*** copy 01-srcset-density-descriptor-selection.md ***

# Output: Which `srcset` Candidate Loads?

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  sizes="50vw"
  alt="A landscape photo">
```

**Question:** On a laptop with a 1920px-wide viewport and a 1x (standard) pixel density, which file does the browser download?

**Answer:** `photo-800.jpg`. `sizes="50vw"` means the image renders at 50% of the 1920px viewport = 960px of CSS pixels. At 1x density, the browser needs a source at least 960px wide; `photo-1600.jpg` (1600w) is the smallest candidate that satisfies that — wait, `photo-800.jpg` is only 800px, which is *less* than 960px needed. The browser will actually select `photo-1600.jpg`, the next candidate at or above the required 960px.

**Why:** The browser computes the required *actual pixel* width by multiplying the CSS-pixel rendered size (from `sizes`) by the device's pixel density, then picks the smallest `w`-descriptor candidate whose width is greater than or equal to that requirement — it never picks one *below* what's needed, since that would mean visibly upscaling a too-small image. This is exactly why `sizes` accuracy matters: an incorrect `sizes` value (e.g. claiming 50vw when the image actually renders at 100vw) causes the browser to consistently pick an image too small for the actual display size, resulting in a blurry/upscaled image despite `srcset` technically being present and "working."
