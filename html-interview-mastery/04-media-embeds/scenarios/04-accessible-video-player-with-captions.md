# Scenario: Making a Company All-Hands Recording Accessible

**Scenario:** Internal tooling publishes recordings of company all-hands meetings as embedded `<video>` elements with no captions. A deaf employee raises that they can't follow the recordings at all, and a low-bandwidth remote employee separately notes the page is slow because the full video preloads on every visit to the page, even when they don't watch it. Fix both issues.

**Diagnosis:** Two independent, real accessibility/UX gaps: (1) no captions means the content is entirely inaccessible to deaf/hard-of-hearing viewers — this isn't a "nice to have," it's a hard access barrier; (2) `preload` is likely defaulting to `auto` or wasn't set at all (browsers vary on the unset default), causing full or substantial video data to download before the user has expressed any intent to watch.

**Fix:**

```html
<video controls preload="metadata" poster="allhands-2026-03-thumb.jpg" width="960" height="540">
  <source src="allhands-2026-03.mp4" type="video/mp4">
  <track kind="captions" src="allhands-2026-03-captions.vtt" srclang="en" label="English" default>
  <p>
    Your browser doesn't support HTML video.
    <a href="allhands-2026-03.mp4">Download the recording</a> or
    <a href="allhands-2026-03-transcript.html">read the transcript</a>.
  </p>
</video>
<p><a href="allhands-2026-03-transcript.html">Read the full transcript</a></p>
```

**Addressing the captions gap:**
- A `.vtt` caption file is generated (via an auto-transcription service, then human-reviewed for accuracy — auto-generated captions alone are frequently inaccurate enough to be a real access barrier on their own, particularly with speaker names, acronyms, and product terminology common in an all-hands) and wired up via `<track kind="captions" default>`.
- A full-text transcript is also linked separately — useful not just as a captions backup but for employees who prefer skimming text over watching a 45-minute recording, and it's independently valuable for search-indexing the content internally.

**Addressing the bandwidth gap:**
- `preload="metadata"` (rather than the browser-default-varying unset state, or an explicit `auto`) ensures only the video's duration/dimensions are fetched upfront — enough to render the player UI correctly — with the actual video data deferred until the user presses play.
- The `poster` image gives a meaningful visual preview without needing to preload any video frames at all.

**Why solving both together matters:** these two fixes don't conflict — captions are about content access once someone chooses to watch, while `preload="metadata"` is about not forcing a download before that choice is made; a common mistake is assuming accessibility fixes and performance fixes trade off against each other, when in this case they're fully complementary and address genuinely different employees' distinct, valid complaints about the same page.
