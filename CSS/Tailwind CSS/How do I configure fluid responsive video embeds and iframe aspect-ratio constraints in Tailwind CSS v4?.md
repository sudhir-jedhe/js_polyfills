In Tailwind CSS v4, responsive video embeds and `iframe` containers rely on native CSS `aspect-ratio` with dimension clamping (`min-h`, `max-h`), eliminating the need for legacy padding-hack wrappers (`pb-[56.25%]`).

---

### Step 1: Register Aspect Ratio & Height Constraints in `@theme`

Define reusable video aspect ratios and dimensional bounds in `globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Standard Video Aspect Ratio Tokens */
  --aspect-video: 16 / 9;
  --aspect-cinema: 21 / 9;
  --aspect-vertical-video: 9 / 16;
  --aspect-classic: 4 / 3;

  /* Fluid Height Constraints (prevents micro-videos on mobile or oversized embeds on ultrawides) */
  --min-h-video-embed: clamp(180px, 150px + 10vw, 240px);
  --max-h-video-embed: clamp(480px, 400px + 20vw, 720px);
}

```

---

### Step 2: Build the Fluid Video Embed Component

This component handles YouTube, Vimeo, Loom, or custom HTML5 `<video>` elements. It constrains the aspect ratio, clips iframe corners safely with `overflow-hidden`, and sets `w-full h-full` on the inner iframe.

```tsx
// components/FluidVideoEmbed.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const videoContainerVariants = cva(
  "relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg",
  {
    variants: {
      aspect: {
        video: "aspect-[16/9]",
        cinema: "aspect-[21/9]",
        vertical: "aspect-[9/16]",
        classic: "aspect-[4/3]",
        square: "aspect-square",
      },
      bounded: {
        true: "min-h-[180px] max-h-[720px]",
        false: "",
      },
    },
    defaultVariants: {
      aspect: "video",
      bounded: true,
    },
  }
);

export interface FluidVideoEmbedProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof videoContainerVariants> {
  src: string;
  title: string;
  allowFullScreen?: boolean;
  type?: "iframe" | "video";
  poster?: string;
}

export function FluidVideoEmbed({
  src,
  title,
  aspect,
  bounded,
  allowFullScreen = true,
  type = "iframe",
  poster,
  className,
  ...props
}: FluidVideoEmbedProps) {
  return (
    <div
      className={cn(videoContainerVariants({ aspect, bounded }), className)}
      {...props}
    >
      {type === "iframe" ? (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={allowFullScreen}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0 object-cover"
        />
      ) : (
        <video
          src={src}
          title={title}
          poster={poster}
          controls
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

```

---

### Step 3: Use with Adaptive Layouts and Container Queries

Pairing responsive video embeds with `@container` allows an embed to switch from a cinematic `21/9` or `16/9` ratio to a square or portrait ratio when placed in narrow columns or sidebars:

```tsx
// components/VideoShowcase.tsx
import { FluidVideoEmbed } from "./FluidVideoEmbed";

export function VideoShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      {/* 1. Primary Full-Width 16:9 Hero Video */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Responsive 16:9 Player
        </h2>
        <FluidVideoEmbed
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
          title="Product Keynote Overview"
          aspect="video"
        />
      </div>

      {/* 2. Multi-column layout with responsive sidebar embeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Area: 21:9 Cinema Ratio */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Cinematic Widescreen (21:9)
          </h3>
          <FluidVideoEmbed
            src="https://player.vimeo.com/video/76979871"
            title="Short Film Showcase"
            aspect="cinema"
          />
        </div>

        {/* Sidebar Panel: 9:16 Vertical Video / Story Format */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Mobile Story (9:16)
          </h3>
          <FluidVideoEmbed
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
            title="Vertical Shorts Preview"
            aspect="vertical"
            className="max-w-[280px] mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

```

---

### Core Aspect-Ratio Troubleshooting Matrix

| Issue                                         | Cause                                                                                          | Fix                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Iframe displays black bars (letterboxing)** | Specified aspect ratio does not match source video stream (e.g., `4/3` stream in `16/9` embed) | Match aspect class to source (`aspect-[16/9]`, `aspect-[4/3]`)      |
| **Embed collapses vertically to 0px**         | Inner iframe used `height: 100%` without parent setting explicit `aspect-ratio` or `min-h`     | Add `aspect-[16/9] w-full` to parent wrapper                        |
| **Video extends past parent grid cell**       | Parent flex/grid item missing min-width constraint                                             | Add `min-w-0` to the parent container                               |
| **Rounded corners clip improperly**           | Missing overflow isolation during GPU accelerated video decoding                               | Add `overflow-hidden rounded-2xl` on the immediate parent container |
