***   Image Loading Strategies (Lazy Loading, Preloading Images, CSS Sprite).md ***

Selecting the right image loading strategy comes down to **when** an asset is needed relative to the user's viewport and interaction path.

| Strategy         | When to Use                                                            | Core Benefit                                              | Drawback / Trade-off                                                                     |
| ---------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Lazy Loading** | Below-the-fold content, long feeds, image galleries                    | Saves bandwidth, speeds up initial page load              | Slight pop-in delay if scrolled fast; hurts LCP if applied above-the-fold                |
| **Preloading**   | Hero images, Largest Contentful Paint (LCP) assets, critical icons     | Reduces LCP render delay, ensures immediate display       | Consumes upfront bandwidth; hurts performance if overused                                |
| **CSS Sprites**  | Repetitive UI icons, button states (hover/active), retro gaming assets | Collapses dozens of HTTP requests into a single roundtrip | Harder to maintain; less critical in HTTP/2+ environments compared to SVG symbol sprites |

---

### 1. Lazy Loading

Defers downloading non-critical images until they are near or inside the user's viewport.

* **Native HTML Implementation:**

```html
<img src="product.jpg" loading="lazy" alt="Product detail" width="600" height="400">

```

* **Best Practices:**
* **Always define `width` and `height`:** Prevents Cumulative Layout Shift (CLS) as placeholders retain the layout space before download.
* **Never lazy load the LCP image:** Keep `loading="lazy"` off hero banners or above-the-fold assets, as it directly penalizes core web vitals.

---

### 2. Preloading Images

Informs the browser to fetch high-priority images immediately in the page lifecycle before the DOM tree finishes rendering them.

* **HTML Implementation:**

```html
<link rel="preload" as="image" href="hero-banner.webp" fetchpriority="high">

```

* **Responsive Preloading:**

```html
<link rel="preload" as="image" href="hero-mobile.webp" media="(max-width: 600px)">
<link rel="preload" as="image" href="hero-desktop.webp" media="(min-width: 601px)">

```

* **Best Practices:**
* Limit preloading to 1–2 critical assets to avoid choking early network bandwidth needed for CSS and critical JavaScript.

---

### 3. CSS Sprites

Combines multiple smaller images or icons into a single raster grid file, using CSS `background-position` to slice out the desired section.

* **CSS Implementation:**

```css
.icon {
  display: inline-block;
  background-image: url('icons-sprite.png');
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
}

.icon-home { background-position: 0 0; }
.icon-user { background-position: -24px 0; }
.icon-cart { background-position: -48px 0; }

```

* **Modern Context:**
* While HTTP/2 multiplexing has reduced the need for raster sprites to bypass connection limits, the sprite paradigm remains popular for vector workflows using **inline SVG `<use>` symbol sprite sheets**.
