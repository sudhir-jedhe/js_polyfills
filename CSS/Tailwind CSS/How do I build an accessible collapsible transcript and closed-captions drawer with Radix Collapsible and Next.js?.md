*** copy How do I build an accessible collapsible transcript and closed-captions drawer with Radix Collapsible and Next.js?.md ***

An accessible video transcript and closed-captions drawer fulfills **WCAG 2.2 Success Criterion 1.2.2 (Captions - Prerecorded)** and **1.2.3 (Audio Description or Media Alternative)**.

Using **Radix UI (`@radix-ui/react-collapsible`)**, you can build a synchronized transcript where each phrase is interactive: clicking a timestamp seeks the video to that exact point, the active cue highlights automatically during playback, and keyboard focus/ARIA controls remain fully accessible.

---

### Step 1: Install Dependencies

```bash
npm install @radix-ui/react-collapsible lucide-react

```

---

### Step 2: Define Transcript Data Structure

Create a type for transcript cues containing timestamps, speaker names, and caption text:

```typescript
// types/transcript.ts
export interface TranscriptCue {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  speaker: string;
  text: string;
}

```

---

### Step 3: Build the Accessible Transcript Drawer Component

```tsx
// components/AccessibleVideoWithTranscript.tsx
"use client";

import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, FileText, Search, Play, Pause } from "lucide-react";
import { TranscriptCue } from "@/types/transcript";

interface AccessibleVideoWithTranscriptProps {
  videoSrc: string;
  posterSrc: string;
  title: string;
  cues: TranscriptCue[];
}

export function AccessibleVideoWithTranscript({
  videoSrc,
  posterSrc,
  title,
  cues,
}: AccessibleVideoWithTranscriptProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const transcriptContainerRef = React.useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [activeCueId, setActiveCueId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [autoScroll, setAutoScroll] = React.useState(true);

  // 1. Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 2. Track video time updates and determine active cue
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    const matchingCue = cues.find((c) => time >= c.start && time <= c.end);
    if (matchingCue && matchingCue.id !== activeCueId) {
      setActiveCueId(matchingCue.id);

      // Auto-scroll transcript container to the active cue
      if (autoScroll && transcriptContainerRef.current) {
        const activeElement = document.getElementById(`cue-${matchingCue.id}`);
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }
  };

  // 3. Seek video to specific timestamp
  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
  };

  // 4. Filter cues by user search term
  const filteredCues = cues.filter((cue) =>
    cue.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cue.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. MEDIA PLAYER                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          controls
          playsInline
          onTimeUpdate={handleTimeUpdate}
          aria-label={title}
          className="w-full h-full object-cover"
        >
          {/* Native WebVTT Track for In-Player Captions */}
          <track
            kind="captions"
            src="/captions/sample-en.vtt"
            srcLang="en"
            label="English"
            default
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. RADIX COLLAPSIBLE TRANSCRIPT DRAWER                             */}
      {/* ------------------------------------------------------------------ */}
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-full">
        
        {/* Drawer Header & Trigger */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Interactive Transcript & Captions
            </h2>
          </div>

          <Collapsible.Trigger asChild>
            <button
              type="button"
              aria-label={isOpen ? "Collapse transcript drawer" : "Expand transcript drawer"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
            >
              <span>{isOpen ? "Hide Transcript" : "Show Transcript"}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </Collapsible.Trigger>
        </div>

        {/* Collapsible Content Area */}
        <Collapsible.Content className="overflow-hidden border-t border-slate-200 dark:border-slate-800 transition-all data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
          <div className="p-4 sm:p-5 space-y-4">
            
            {/* Toolbar: Search & Auto-scroll Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter transcript by keyword"
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                Auto-scroll with playback
              </label>
            </div>

            {/* Scrollable Cues Container */}
            <div
              ref={transcriptContainerRef}
              tabIndex={0}
              role="region"
              aria-label="Synchronized video transcript text"
              className="max-h-72 overflow-y-auto space-y-2 pr-2 divide-y divide-slate-100 dark:divide-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            >
              {filteredCues.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">
                  No matching transcript cues found for &quot;{searchQuery}&quot;.
                </p>
              ) : (
                filteredCues.map((cue) => {
                  const isActive = cue.id === activeCueId;

                  return (
                    <button
                      key={cue.id}
                      id={`cue-${cue.id}`}
                      type="button"
                      onClick={() => seekTo(cue.start)}
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`Jump to ${formatTime(cue.start)}, Speaker ${cue.speaker}: ${cue.text}`}
                      className={`group w-full text-left p-3 pt-4 rounded-xl transition-colors flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950/40 border-l-4 border-indigo-600 dark:border-indigo-400"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent"
                      }`}
                    >
                      {/* Timestamp Badge */}
                      <span className="shrink-0 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {formatTime(cue.start)}
                      </span>

                      {/* Speaker & Content */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                          {cue.speaker}
                        </span>
                        <p className={`text-xs leading-relaxed ${isActive ? "text-slate-900 dark:text-white font-medium" : "text-slate-600 dark:text-slate-400"}`}>
                          {cue.text}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Screen Reader Live Region for Active Cue */}
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {activeCueId && cues.find((c) => c.id === activeCueId)?.text}
            </div>

          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}

```

---

### Step 4: Sample Implementation Page

```tsx
// app/video-demo/page.tsx
import { AccessibleVideoWithTranscript } from "@/components/AccessibleVideoWithTranscript";
import { TranscriptCue } from "@/types/transcript";

const SAMPLE_TRANSCRIPT: TranscriptCue[] = [
  {
    id: "cue-1",
    start: 0,
    end: 4,
    speaker: "Elena Rostova",
    text: "Welcome to this technical session on OKLCH color interpolation in modern web design systems.",
  },
  {
    id: "cue-2",
    start: 4.1,
    end: 9,
    speaker: "Elena Rostova",
    text: "Traditional RGB and HSL models introduce perceptual distortions when calculating high-contrast dark themes.",
  },
  {
    id: "cue-3",
    start: 9.1,
    end: 15,
    speaker: "Marcus Chen",
    text: "By decoupling Lightness, Chroma, and Hue, OKLCH guarantees uniform contrast ratios across all screen types.",
  },
  {
    id: "cue-4",
    start: 15.1,
    end: 22,
    speaker: "Elena Rostova",
    text: "Let's inspect how fluid typography tokens integrate seamlessly with container queries in Tailwind CSS v4.",
  },
];

export default function VideoDemoPage() {
  return (
    <main className="min-h-screen p-6 sm:p-12 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center">
      <AccessibleVideoWithTranscript
        title="OKLCH Design Tokens and Container Queries"
        videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        posterSrc="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80"
        cues={SAMPLE_TRANSCRIPT}
      />
    </main>
  );
}

```

---

### Step 5: Smooth Accordion Animation in `globals.css`

Add keyframes for Radix Collapsible smooth expand/collapse transitions:

```css
/* app/globals.css */
@keyframes collapse-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
  }
}

@keyframes collapse-up {
  from {
    height: var(--radix-collapsible-content-height);
  }
  to {
    height: 0;
  }
}

.animate-collapse-down {
  animation: collapse-down 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-collapse-up {
  animation: collapse-up 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

```

---

### Key Accessibility Features Built-In

* **WCAG 1.2.2 / 1.2.3 Alignment:** Synchronizes both an embedded HTML5 `<track kind="captions">` and an external searchable text alternative.
* **Keyboard-Navigable Jump Points:** Every transcript cue is an accessible `<button>` equipped with `aria-label` describing the timestamp and speaker.
* **Active Cue Live Region:** Screen reader users receive live subtitle updates via `<div role="status" aria-live="polite">` without moving virtual cursor focus.
* **Scroll Boundary Containment (`role="region"`):** The scrollable transcript list has `tabIndex={0}` so keyboard-only users can scroll through long transcripts using `ArrowUp`/`ArrowDown`/`PageDown`.
