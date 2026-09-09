***  Pause control button to background video banners in React and Tailwind?.md ***

To comply with **WCAG 2.2 Success Criterion 2.2.2 (Pause, Stop, Hide)**, any moving or auto-playing content lasting more than 5 seconds must provide a clear mechanism for users to pause, stop, or hide it.

An accessible background video controller requires:

1. **Dynamic state tracking (`isPlaying`)** connected to the HTML5 video element.
2. **Accessible name & ARIA live feedback** via `aria-label`, `aria-pressed`, and a polite `role="status"` region.
3. **Respect for OS motion preferences (`prefers-reduced-motion`)** by defaulting to paused when motion reduction is detected.
4. **Reliable keyboard focus & contrast** with a high-contrast focus ring that stands out over moving video pixels.

---

### Step 1: Install Icons

```bash
npm install lucide-react

```

---

### Step 2: Build the Accessible Video Hero Component

```tsx
// components/AccessibleVideoHero.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

interface AccessibleVideoHeroProps {
  videoSrc: string;
  posterSrc: string;
  badgeText?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
}

export function AccessibleVideoHero({
  videoSrc,
  posterSrc,
  badgeText = "Accessible Hero Banner",
  title,
  description,
  primaryActionLabel = "Get Started",
  secondaryActionLabel = "Learn More",
}: AccessibleVideoHeroProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isReducedMotion, setIsReducedMotion] = React.useState(false);

  // 1. Detect user's OS prefers-reduced-motion setting
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    // Default to paused state if the user prefers reduced motion
    if (mediaQuery.matches) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 2. Toggle Play/Pause handler
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section 
      aria-label="Featured Introduction" 
      className="relative w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[21/9] min-h-[420px] max-h-[720px] flex items-center shadow-2xl"
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. MEDIA LAYER (Video + Poster Fallback)                           */}
      {/* ------------------------------------------------------------------ */}
      <video
        ref={videoRef}
        autoPlay={!isReducedMotion}
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        poster={posterSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Static Fallback Poster when OS Reduced Motion is enabled */}
      {isReducedMotion && (
        <div className="absolute inset-0 select-none pointer-events-none">
          <Image
            src={posterSrc}
            alt="Hero background still visual"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* WCAG Contrast Gradient Overlay */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent dark:from-black/95 dark:via-black/75 dark:to-black/35 pointer-events-none" 
      />

      {/* ------------------------------------------------------------------ */}
      {/* 2. FOREGROUND CONTENT LAYER                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 py-12 flex flex-col justify-center gap-6">
        
        {badgeText && (
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse motion-reduce:animate-none" />
            {badgeText}
          </div>
        )}

        <div className="max-w-2xl space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] break-words">
            {title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

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

      {/* ------------------------------------------------------------------ */}
      {/* 3. ACCESSIBLE PLAY/PAUSE CONTROL (WCAG 2.2.2)                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          type="button"
          onClick={togglePlayPause}
          aria-pressed={!isPlaying}
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
          className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-slate-900 hover:border-white/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-95"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5 text-indigo-400 transition-transform group-hover:scale-110" aria-hidden="true" />
              <span>Pause Video</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 text-indigo-400 transition-transform group-hover:scale-110" aria-hidden="true" />
              <span>Play Video</span>
            </>
          )}
        </button>

        {/* Live Region Announcement for Screen Readers */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {isPlaying ? "Background video playing" : "Background video paused"}
        </div>
      </div>
    </section>
  );
}

```

---

### Step 3: WCAG Accessibility Specifications Met

| WCAG Criteria / A11y Requirement                    | How It Is Handled                                                                                                                             |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **WCAG 2.2.2: Pause, Stop, Hide (Level A)**         | Dedicated, keyboard-focusable control pauses moving video immediately.                                                                        |
| **Screen Reader Context**                           | Button uses dynamic `aria-label` ("Pause background video" vs "Play background video") and `aria-pressed`.                                    |
| **Status Feedback**                                 | An inline `<div role="status" aria-live="polite">` announces play/pause state changes to screen reader users.                                 |
| **OS Motion Respect**                               | Automatically defaults to paused when `prefers-reduced-motion: reduce` is active.                                                             |
| **Background Decorative Role**                      | The `<video>` element has `aria-hidden="true"` and `tabIndex={-1}` so screen readers do not treat it as an unlabelled focusable media player. |
| **Focus Indicator Contrast (WCAG 2.4.11 / 2.4.13)** | `focus-visible:ring-4 focus-visible:ring-indigo-400` with `ring-offset-slate-950` guarantees high visual contrast against dark backgrounds.   |

---

### Step 4: Write Playwright E2E Tests for the Play/Pause Action

```typescript
// e2e/video-play-pause.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Background Video Controls Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-accessiblevideohero--default&viewMode=story");
    await page.waitForLoadState("networkidle");
  });

  test("toggles video play and pause states with keyboard navigation", async ({ page }) => {
    const pauseBtn = page.getByRole("button", { name: /pause background video/i });
    await expect(pauseBtn).toBeVisible();

    // 1. Focus button via keyboard
    await pauseBtn.focus();
    await expect(pauseBtn).toBeFocused();

    // 2. Press Enter to pause video
    await page.keyboard.press("Enter");

    // Button label and aria-pressed update
    const playBtn = page.getByRole("button", { name: /play background video/i });
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toHaveAttribute("aria-pressed", "true");

    // Live region informs screen readers
    const liveRegion = page.getByRole("status");
    await expect(liveRegion).toHaveText(/background video paused/i);

    // Verify video DOM element is paused
    const isPaused = await page.locator("video").evaluate((v: HTMLVideoElement) => v.paused);
    expect(isPaused).toBe(true);

    // 3. Press Space to resume playback
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /pause background video/i })).toBeVisible();
    await expect(liveRegion).toHaveText(/background video playing/i);
  });
});

```
