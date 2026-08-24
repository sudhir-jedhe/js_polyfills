In Tailwind CSS, drop shadows are applied using the `drop-shadow-*` filter utilities (which use CSS `filter: drop-shadow(...)`).

Unlike `shadow-*` (which uses `box-shadow` and outlines the rectangular bounding box), `drop-shadow-*` conforms to the exact alpha transparency contours of images, SVGs, clipped shapes, and speech bubbles.

---

### Standard `drop-shadow` Utility Scale

| Class              | CSS Definition                                        |
| ------------------ | ----------------------------------------------------- |
| `drop-shadow-xs`   | `filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));`   |
| `drop-shadow-sm`   | `filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.15));`   |
| `drop-shadow-md`   | `filter: drop-shadow(0 3px 3px rgb(0 0 0 / 0.12));`   |
| `drop-shadow-lg`   | `filter: drop-shadow(0 4px 4px rgb(0 0 0 / 0.15));`   |
| `drop-shadow-xl`   | `filter: drop-shadow(0 9px 7px rgb(0 0 0 / 0.1));`    |
| `drop-shadow-2xl`  | `filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));` |
| `drop-shadow-none` | `filter: drop-shadow(0 0 #0000);`                     |

---

### Usage Examples

#### 1. Transparent PNGs and Non-Rectangular Images

`drop-shadow` hugs the subject's transparent outline rather than casting a box shadow around the entire image frame:

```html
<img
  src="/images/product-transparent.png"
  alt="Wireless Headset"
  class="w-64 drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300"
/>

```

#### 2. SVGs, Icons, and Badges

```html
<svg class="h-12 w-12 fill-indigo-600 drop-shadow-md" viewBox="0 0 24 24">
  <!-- Path outlines will cast the shadow directly -->
  <path d="..." />
</svg>

```

#### 3. Speech Bubble / Tooltip with a Pseudo-Arrow

Because `box-shadow` cannot trace arrow pointers created with CSS triangles or `clip-path`, `drop-shadow` is required on the parent:

```html
<div class="relative rounded-xl bg-slate-900 px-4 py-2 text-white drop-shadow-lg">
  <span>Notification bubble with pointer</span>
  <!-- Arrow pointer (bottom) -->
  <div class="absolute -bottom-2 left-6 h-4 w-4 rotate-45 bg-slate-900"></div>
</div>

```

---

### Custom Drop Shadows

#### Arbitrary Values

Use square bracket notation for one-off values:

```html
<img class="drop-shadow-[0_10px_15px_rgba(99,102,241,0.35)]" src="..." />

```

#### Defining in Tailwind CSS v4 `@theme`

Register custom drop-shadow tokens inside `@theme` in `globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --drop-shadow-glow: 0 0 15px oklch(0.65 0.24 260 / 0.4);
  --drop-shadow-soft: 0 8px 16px oklch(0.15 0.02 240 / 0.12);
}

```

Use them directly in markup:

```html
<div class="drop-shadow-glow">Glowing Element</div>

```

---

### `drop-shadow-*` vs `shadow-*` (When to use which)

| Feature               | `drop-shadow-*` (`filter`)                                   | `shadow-*` (`box-shadow`)                     |
| --------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| **Applies To**        | Actual pixel alpha mask (SVGs, PNGs, arrows, clipped shapes) | Rectangular CSS box model boundaries          |
| **Performance**       | Triggers GPU layer compositing                               | Highly optimized by browser rendering engines |
| **Inner Shadows**     | No (`inset` is not supported)                                | Yes (`shadow-inner`)                          |
| **Primary Use Cases** | Icons, cutouts, speech bubble arrows, badges                 | Standard cards, buttons, modals, input fields |
