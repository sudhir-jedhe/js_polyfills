*** copy Prevent overflow with line-clamp and fluid aspect constraints.md ***

To prevent visual overflow across cards, editorial previews, and adaptive media tiles, combine three CSS layout techniques:

1. **Multi-line Text Truncation (`line-clamp`)** with min-content safety fallbacks (`min-w-0`, `break-words`).
2. **Fluid Aspect-Ratio Constraints (`aspect-[...]`)** with explicit minimum/maximum height limits (`min-h-[...]`, `max-h-[...]`) to avoid vertical layout collapse.
3. **Container-Relative Media Fitting (`object-cover`)** so imagery fluidly conforms to varying container boundaries without stretching or causing container blowouts.

---

### Step 1: Declaring Token Extensions in Tailwind CSS v4

Configure semantic aspect ratios and multi-line clamps in `app/globals.css` using the `@theme` block:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Fluid Aspect Ratio Tokens */
  --aspect-video-fluid: 16 / 9;
  --aspect-portrait-fluid: 4 / 5;
  --aspect-card-media: 16 / 10;
  --aspect-square-fluid: 1 / 1;

  /* Min/Max Fluid Dimension Bounds */
  --min-h-media-sm: 140px;
  --max-h-media-sm: 220px;

  --min-h-media-lg: 240px;
  --max-h-media-lg: 420px;
}

```

---

### Step 2: The Resilient Overflow Card Component

The most common cause of text blowouts in flex and grid layouts is the default `min-width: auto` rule on flex children. Adding **`min-w-0`** to parent containers is required for `line-clamp-*` and `truncate` to activate properly without overflowing parent boundaries.

```tsx
// components/FluidMediaCard.tsx
import * as React from "react";
import Image from "next/image";

interface FluidMediaCardProps {
  imageSrc: string;
  imageAlt: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
}

export function FluidMediaCard({
  imageSrc,
  imageAlt,
  category,
  title,
  description,
  author,
  date,
}: FluidMediaCardProps) {
  return (
    // 'min-w-0' enables line-clamp inside CSS Grid/Flex children
    <article className="group relative flex flex-col min-w-0 w-full overflow-hidden rounded-2xl bg-surface border border-border shadow-sm transition-all hover:shadow-md">
      
      {/* ------------------------------------------------------------------ */}
      /* 1. FLUID MEDIA WRAPPER: Aspect ratio with min/max height safeguards */
      /* ------------------------------------------------------------------ */}
      <div className="relative w-full aspect-[16/10] min-h-[140px] max-h-[260px] overflow-hidden bg-surface-muted">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-md bg-background/90 text-foreground backdrop-blur-sm border border-border/50">
          {category}
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      /* 2. TEXT CONTENT: Strict multi-line clamps with min-w-0 safeguards  */
      /* ------------------------------------------------------------------ */}
      <div className="flex flex-col flex-1 min-w-0 p-5 gap-2">
        {/* Title constrained to 2 lines */}
        <h3
          className="text-lg font-bold text-foreground tracking-tight leading-snug line-clamp-2 break-words"
          title={title}
        >
          {title}
        </h3>

        {/* Body excerpt constrained to 3 lines */}
        <p
          className="text-sm text-foreground/75 leading-relaxed line-clamp-3 break-words"
          title={description}
        >
          {description}
        </p>

        {/* ---------------------------------------------------------------- */}
        /* 3. CARD FOOTER: Single-line truncation with ellipsis              */
        /* ---------------------------------------------------------------- */}
        <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between gap-2 min-w-0 text-xs text-foreground/60">
          <span className="font-medium truncate min-w-0" title={author}>
            By {author}
          </span>
          <time className="shrink-0">{date}</time>
        </div>
      </div>
    </article>
  );
}

```

---

### Step 3: Composite Grid Layout with Container Constraints

When rendering variable-length editorial content inside responsive grids, combine `@container` queries with fluid aspect wrappers so cards adjust automatically across narrow sidebars and full-width main feeds:

```tsx
// components/CardGrid.tsx
import { FluidMediaCard } from "./FluidMediaCard";

const DEMO_ITEMS = [
  {
    imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Abstract 3D render with geometric shapes and soft pastel gradients",
    category: "Design Systems",
    title: "Deep Dive into OKLCH Color Interpolation and Wide-Gamut Visual Regression Strategies for Enterprise Web Apps",
    description:
      "Modern web browsers support wide-gamut displays through the OKLCH color space. This guide explores how to prevent clipped text nodes, avoid layout shift in dynamic typography engines, and ensure perceptually uniform dark variations across custom design system tokens.",
    author: "Elena Rostova, Principal Design Technologist",
    date: "Aug 21, 2026",
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Retro computer monitor glowing in a dim room",
    category: "Architecture",
    title: "Container Queries in Action",
    description: "Compact summary without excessive vertical sprawl.",
    author: "Alex Rivera",
    date: "Aug 19, 2026",
  },
];

export function EditorialGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_ITEMS.map((item, idx) => (
          <FluidMediaCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
}

```

---

### Step 4: Overflow Failure Modes & Prevention Matrix

| Failure Mode                       | Underlying Root Cause                                                                 | Tailwind Solution                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Horizontal Blowout**             | Flex/Grid items have default `min-width: auto` and refuse to shrink below text length | Add `min-w-0` to all flex/grid parent containers                       |
| **Unbroken URL/Code Spills**       | Long alphanumeric strings lack natural whitespace breaks                              | Add `break-words` or `break-all`                                       |
| **Media Aspect Flattening**        | Pure `aspect-ratio` on small viewports collapses image height to zero                 | Add `min-h-[140px]` alongside `aspect-[16/10]`                         |
| **Media Vertical Stretch**         | Pure `aspect-ratio` inside tall grid cells causes huge image blocks                   | Add `max-h-[320px]` and `object-cover`                                 |
| **Single-Line Truncation Failure** | Missing `truncate` without container width boundary                                   | `truncate min-w-0` (`overflow-hidden text-ellipsis whitespace-nowrap`) |
| **Multi-Line Text Inconsistency**  | Variable body copy length creates jagged card heights                                 | `line-clamp-2` or `line-clamp-3` with `mt-auto` on the card footer     |
