*** copy How do I configure a fluid background video hero banner with aspect-ratio constraints and reduced-motion fallbacks in Tailwind CSS v4?.md ***

To configure a fluid background video hero banner in Tailwind CSS v4, combine **CSS `aspect-ratio` bounds (`min-h`/`max-h`)**, **`object-cover` absolute positioning**, and **`motion-reduce:` / `forced-colors:` accessibility fallbacks** so the video smoothly scales without clipping text, and swaps to a static poster when reduced motion is preferred.

---

### Step 1: Define Hero Aspect & Height Tokens in `@theme`

In `app/globals.css`, configure responsive height clamps and aspect tokens inside `@theme`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Hero Aspect Ratio & Dimensional Bounds */
  --aspect-hero-fluid: 21 / 9;
  --min-h-hero: clamp(26rem, 20rem + 25vw, 42rem); /* 416px to 672px */
  --max-h-hero: clamp(36rem, 30rem + 30vw, 56rem); /* 576px to 896px */
}

```

---

### Step 2: Build the Fluid Video Hero Component

This component:

1. Keeps the video completely fluid with `object-cover` and `absolute inset-0`.
2. Employs `motion-reduce:hidden` on the `<video>` element and shows an optimized static poster image if the user enabled OS reduced motion (`prefers-reduced-motion: reduce`).
3. Uses relative z-indexed content layers to keep text legible and interactive.
4. Includes an overlay gradient that protects WCAG contrast ratios.

```tsx
// components/HeroVideoBanner.tsx
import * as React from "react";
import Image from "next/image";

interface HeroVideoBannerProps {
  videoSrc: string;
  posterSrc: string;
  badgeText?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
}

export function HeroVideoBanner({
  videoSrc,
  posterSrc,
  badgeText = "Next-Gen Design System",
  title,
  description,
  primaryActionLabel = "Explore Platform",
  secondaryActionLabel = "View Documentation",
}: HeroVideoBannerProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[21/9] min-h-[var(--min-h-hero)] max-h-[var(--max-h-hero)] flex items-center shadow-2xl">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. ACCESSIBLE MEDIA LAYER (Video vs Reduced-Motion Poster)          */}
      {/* ------------------------------------------------------------------ */}
      
      {/* Dynamic Video: Hidden when user prefers reduced motion */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        poster={posterSrc}
        className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none motion-reduce:hidden"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Static Fallback Poster: Displayed strictly when motion is reduced */}
      <div className="absolute inset-0 hidden motion-reduce:block select-none pointer-events-none">
        <Image
          src={posterSrc}
          alt="Hero background visual"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Contrast Overlay Gradients: Guarantees WCAG AAA text contrast */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent dark:from-black/95 dark:via-black/75 dark:to-black/30 pointer-events-none" 
      />

      {/* ------------------------------------------------------------------ */}
      {/* 2. FOREGROUND CONTENT LAYER                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 py-12 flex flex-col justify-center gap-6">
        
        {/* Category / Release Badge */}
        {badgeText && (
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse motion-reduce:animate-none" />
            {badgeText}
          </div>
        )}

        {/* Hero Title & Excerpt */}
        <div className="max-w-2xl space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] break-words">
            {title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50 active:scale-95"
          >
            {primaryActionLabel}
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-95"
          >
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

```

---

### Step 3: Implement on an Adaptive Page

```tsx
// app/page.tsx
import { HeroVideoBanner } from "@/components/HeroVideoBanner";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <HeroVideoBanner
        videoSrc="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1738-large.mp4"
        posterSrc="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80"
        badgeText="v4 Fluid Tokens Engine"
        title="High-performance fluid layouts with zero layout shifts."
        description="Deliver cinematic background video experiences that dynamically scale across ultra-wides, tablets, and phones while fully respecting user accessibility preferences."
      />
    </main>
  );
}

```

---

### Step 4: Write Playwright Accessibility & Reduced-Motion Tests

Verify that Playwright emulating `reducedMotion: 'reduce'` properly swaps the video for the static poster:

```typescript
// e2e/hero-banner.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Hero Video Banner Accessibility", () => {
  test("plays video when standard motion is enabled", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video");
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("muted");
  });

  test("hides video and renders fallback poster image when reduced-motion is active", async ({ page }) => {
    // 1. Emulate prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 2. Video element should be hidden via motion-reduce:hidden
    const video = page.locator("video");
    await expect(video).toBeHidden();

    // 3. Static poster fallback must be visible
    const poster = page.getByAltText(/hero background visual/i);
    await expect(poster).toBeVisible();
  });
});

```

---

### Summary Checklist for Video Hero Banners

* **`aspect-[21/9]` + `min-h`/`max-h`:** Keeps the banner cinematic on desktop while preventing vertical collapsing on narrow mobile viewports.
* **`motion-reduce:hidden`:** Disables autoplaying visual motion for vestibular motion-sensitive users.
* **`aria-hidden="true"` & `tabIndex={-1}`:** Keeps purely decorative background video streams out of screen reader reading flows and keyboard navigation order.
* **Double Contrast Protection:** Combines a directional linear gradient (`bg-gradient-to-r`) with a dark base background (`bg-slate-950`) to keep text readable even before the video loads.
