*** copy 06-video-autoplay-without-muted.md ***

# Output: `autoplay` Without `muted`

```html
<video autoplay controls>
  <source src="promo.mp4" type="video/mp4">
</video>
```

**Question:** Does this video actually start playing automatically when the page loads, in a typical modern browser?

**Answer:** No — every major modern browser (Chrome, Firefox, Safari, Edge) blocks autoplay of video **with audio** by default, regardless of the `autoplay` attribute being present. The video loads and shows its first frame/poster, with the `controls` UI available for the user to manually press play, but it does not begin playing on its own. No error is thrown — the autoplay attempt simply fails silently per each browser's autoplay policy.

**Why:** This is a deliberate, user-respecting anti-annoyance policy implemented independently by browser vendors, not a bug or a spec omission — unsolicited audio playback on page load was a widespread, disliked pattern in the pre-policy era of the web. The only reliable way to get actual autoplay behavior is `autoplay muted` (browsers uniformly permit autoplay of *muted* video, since it can't unexpectedly blast audio) — and even then, some browsers apply additional heuristics (like a site-specific "media engagement index") that can still override it, which is why autoplay should always be treated as a best-effort progressive enhancement, with `controls` always present as a guaranteed fallback path for the user to start playback manually.
