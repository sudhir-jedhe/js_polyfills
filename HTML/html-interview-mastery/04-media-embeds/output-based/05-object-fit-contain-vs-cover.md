***  05-object-fit-contain-vs-cover.md ***

# Output: `object-fit: contain` vs. `cover` on a Non-Matching Aspect Ratio

```html
<img src="wide-banner.jpg" style="width: 300px; height: 300px; object-fit: contain;" alt="A wide banner image">
```

**Question:** The source image `wide-banner.jpg` is 1600×400px (a 4:1 wide aspect ratio). The box is a 300×300px square. What does the rendered result actually look like?

**Answer:** The image is scaled down proportionally until it fits *entirely* within the 300×300 box on its longest constraining axis — since the image is much wider than tall, it scales to fill the full 300px width, and its height becomes proportionally tiny (300 ÷ 4 = 75px). The remaining vertical space (300 − 75 = 225px, split above and below by default `object-position: 50% 50%`) is left as empty, transparent letterboxing — no part of the image is cropped, but a large portion of the square box shows nothing.

**Why:** `object-fit: contain` guarantees the *entire* source image remains visible, at the cost of potentially leaving significant empty space when the box's aspect ratio differs substantially from the source's — this is the opposite trade-off from `cover`, which would instead scale the image up until it fills the full 300×300 box completely (height-constrained here, scaling to 300px tall, making the width balloon to 1200px) and crop away everything beyond 300px of that width, showing zero empty space but losing most of the image's horizontal content. Neither is "correct" in isolation — `contain` is right when showing the complete image matters more than filling the box (e.g. a logo), and `cover` is right when filling the box matters more than showing 100% of the source (e.g. a photo thumbnail grid).
