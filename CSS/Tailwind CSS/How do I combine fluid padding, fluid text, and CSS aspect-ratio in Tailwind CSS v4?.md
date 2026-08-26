*** copy How do I combine fluid padding, fluid text, and CSS aspect-ratio in Tailwind CSS v4?.md ***

Combining **fluid padding**, **fluid text**, and **`aspect-ratio`** inside a query container produces a self-contained card or media block that scales all of its interior proportions simultaneously without layout shifts or text overflow.

---

### Step 1: Register Fluid Spacing and Typography in `@theme`

In your main CSS file (`globals.css` / `index.css`), define your fluid tokens using container query units (`cqi`):

```css
@import "tailwindcss";

@theme {
  /* Fluid Typography */
  --font-size-fluid-title: clamp(1.125rem, 0.85rem + 1.75cqi, 2.25rem);
  --font-size-fluid-body: clamp(0.8125rem, 0.7rem + 0.65cqi, 1.125rem);
  --font-size-fluid-badge: clamp(0.7rem, 0.6rem + 0.45cqi, 0.875rem);

  /* Fluid Spacing (Applies to padding, gaps, margins, insets) */
  --spacing-fluid-card: clamp(1rem, 0.5rem + 2.5cqi, 2.5rem);
  --spacing-fluid-gap: clamp(0.5rem, 0.25rem + 1.25cqi, 1.25rem);

  /* Custom Aspect Ratios */
  --aspect-banner: 16 / 9;
  --aspect-portrait-card: 4 / 5;
}

```

---

### Step 2: Build the Proportional Card Component

Wrap the card in `@container` so that `cqi` units and container modifiers calculate directly against the component's width:

```jsx
export function ProportionalMediaCard({
  imageSrc,
  category,
  title,
  excerpt,
  ctaText,
}) {
  return (
    /* 1. Container Boundary */
    <div className="@container w-full">
      {/* 2. Aspect-ratio fixed container with background image overlay */}
      <article className="relative w-full aspect-portrait-card @md:aspect-video @3xl:aspect-banner rounded-3xl overflow-hidden shadow-xl group">
        
        {/* Background Image filling full aspect ratio */}
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* 3. Fluid Content Overlay with fluid padding and fluid gap */}
        <div className="relative h-full flex flex-col justify-end p-fluid-card gap-fluid-gap text-white">
          
          {/* Badge */}
          <span className="self-start px-2.5 py-1 text-fluid-badge font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full border border-white/20">
            {category}
          </span>

          {/* Fluid Heading */}
          <h2 className="text-fluid-title font-bold leading-tight line-clamp-2">
            {title}
          </h2>

          {/* Fluid Excerpt */}
          <p className="text-fluid-body text-slate-300 line-clamp-2 max-w-xl">
            {excerpt}
          </p>

          {/* Action Row */}
          <div className="pt-2">
            <button className="px-4 py-2 text-fluid-body font-medium bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
              {ctaText}
            </button>
          </div>

        </div>
      </article>
    </div>
  );
}

```

---

### How the Elements Interact

```
┌─────────────────────────────────────────────────────────────┐
│ @container parent                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ aspect-portrait-card (@md:aspect-video)               │  │
│  │                                                       │  │
│  │  p-fluid-card ──────────────────────────────────────┐ │  │
│  │  │ [Badge]        (text-fluid-badge)                │ │  │
│  │  │                                                  │ │  │
│  │  │ [Title]        (text-fluid-title)                │ │  │
│  │  │   gap-fluid-gap                                  │ │  │
│  │  │ [Excerpt]      (text-fluid-body)                 │ │  │
│  │  │                                                  │ │  │
│  │  │ [Button]       (text-fluid-body)                 │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

```

* **Aspect Ratio:** Enforces proportional geometric constraints on the card frame (`4:5` on narrow slots, changing to `16:9` at `@md:`).
* **Fluid Padding (`p-fluid-card`):** Shrinks the frame inset in smaller containers so text has room to breathe, and expands gracefully on wider displays.
* **Fluid Text (`text-fluid-*`):** Smoothly scales typography across dimensions without causing multi-line word wrapping collisions.

---

### Alternative: Inline Arbitrary Values

To apply this pattern directly without configuring `@theme`:

```html
<div class="@container w-full">
  <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden p-[clamp(1rem,4cqi,2.5rem)] flex flex-col justify-end bg-slate-900 text-white">
    <h3 class="text-[clamp(1rem,3cqi,2rem)] font-bold">
      Inline Fluid Aspect Card
    </h3>
    <p class="text-[clamp(0.75rem,1.5cqi,1rem)] text-slate-300 mt-[clamp(0.25rem,1cqi,0.75rem)]">
      Self-scaling proportional layout.
    </p>
  </div>
</div>

```
