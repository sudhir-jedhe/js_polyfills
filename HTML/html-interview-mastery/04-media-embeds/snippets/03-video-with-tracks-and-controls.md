*** copy 03-video-with-tracks-and-controls.md ***

# Snippet: `<video>` with Captions and Fallback Sources

```html
<video controls poster="thumb.jpg" preload="metadata" width="800" height="450">
  <source src="talk.webm" type="video/webm">
  <source src="talk.mp4" type="video/mp4">
  <track kind="captions" src="talk-captions-en.vtt" srclang="en" label="English" default>
  <track kind="captions" src="talk-captions-fr.vtt" srclang="fr" label="Français">
  <p>Your browser doesn't support HTML video. <a href="talk.mp4">Download the video</a>.</p>
</video>
```

```
# talk-captions-en.vtt (WebVTT format)
WEBVTT

00:00:00.000 --> 00:00:04.000
Welcome to this talk on HTML accessibility.

00:00:04.500 --> 00:00:08.000
Today we'll cover captions, tracks, and more.
```

`default` on the English track means it's active automatically on load. The two `<source>` elements let the browser pick whichever format it supports (`webm` is often smaller/more efficient, `mp4` has the broadest compatibility) — the same fallback mechanism `<picture>` uses for format selection.
