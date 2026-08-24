# Problem: Build an Accessible Video Player with Captions from Scratch

## Problem Statement

Build a `<video>` embed for a tutorial video that: shows a poster before playback, doesn't preload the full video, provides English and Spanish captions with English active by default, provides a fallback for browsers without video support, and reserves layout space to avoid shift.

## Constraints

- Must use native `<video>` controls (no custom player UI required for this exercise).
- Captions must be provided via `<track>`, not burned into the video.
- Must specify multiple caption languages with a sensible default.
- Fallback content must give users a way to still access the video if their browser can't play it inline.

## Solution

```html
<video
  controls
  poster="tutorial-01-poster.jpg"
  preload="metadata"
  width="960" height="540">
  <source src="tutorial-01.webm" type="video/webm">
  <source src="tutorial-01.mp4" type="video/mp4">
  <track kind="captions" src="tutorial-01-en.vtt" srclang="en" label="English" default>
  <track kind="captions" src="tutorial-01-es.vtt" srclang="es" label="Español">
  <p>
    Your browser doesn't support HTML video.
    <a href="tutorial-01.mp4">Download the video</a> instead.
  </p>
</video>
```

```
# tutorial-01-en.vtt
WEBVTT

00:00:00.000 --> 00:00:03.500
Welcome to this tutorial on building forms.

00:00:03.500 --> 00:00:07.000
We'll start by creating the basic HTML structure.
```

**Why this satisfies the constraints:** `poster` provides a meaningful preview before any video data loads; `preload="metadata"` fetches only duration/dimensions, deferring the actual video payload until playback is requested. Two `<source>` elements let the browser pick whichever format it supports (WebM first for efficiency, MP4 as the broad-compatibility fallback). Two `<track kind="captions">` elements provide both languages, with `default` marking English as active on load — a user can still switch to Spanish via the native controls' captions menu. The fallback `<p>` inside `<video>` is only rendered by browsers with zero video support, giving those users a direct download link rather than a silently blank space. `width`/`height` reserve the 960×540 aspect ratio immediately, so the surrounding page layout doesn't shift once the video/poster finishes loading.
