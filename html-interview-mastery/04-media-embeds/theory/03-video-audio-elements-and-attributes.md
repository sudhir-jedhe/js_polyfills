# `<video>` and `<audio>` Elements and Attributes

## `<video>` core attributes

```html
<video
  controls
  poster="thumbnail.jpg"
  preload="metadata"
  width="800" height="450">
  <source src="movie.webm" type="video/webm">
  <source src="movie.mp4" type="video/mp4">
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English" default>
  <p>Your browser doesn't support HTML video. <a href="movie.mp4">Download the video</a>.</p>
</video>
```

| Attribute | Effect |
|---|---|
| `controls` | Shows the browser's native play/pause/volume/seek UI — omit only if you're building fully custom controls |
| `poster` | Image shown before playback starts — without it, the browser shows the first frame (or nothing) |
| `preload` | `none` (don't preload anything until play is requested), `metadata` (load duration/dimensions only — a good default), `auto` (browser may preload the whole video) |
| `width`/`height` | Reserves layout space before the video loads, preventing layout shift (relevant to Cumulative Layout Shift) |
| Multiple `<source>` | Browser picks the first one whose `type` it supports — same fallback mechanism as `<picture>` |
| Fallback content (the `<p>`) | Shown only in the rare case of a browser with zero `<video>` support at all |

## `autoplay` requires `muted` — and even then isn't guaranteed

```html
<video autoplay muted loop playsinline>
  <source src="background-loop.mp4" type="video/mp4">
</video>
```

Every major browser blocks autoplay of videos **with sound** — this is a deliberate, user-respecting policy, not a bug to work around. `autoplay` only reliably works when paired with `muted` (and typically `playsinline` on mobile Safari, to prevent it from forcing fullscreen playback). Even muted autoplay can still be blocked by browser heuristics (e.g. data-saver mode, or a site with a poor "media engagement index"), so autoplay should always be treated as a progressive enhancement, never a guaranteed behavior — always ensure `controls` (or a custom play button) is available as a fallback so the user isn't stuck with a black box.

## `<track>` for captions/subtitles

```html
<track kind="captions" src="captions-en.vtt" srclang="en" label="English" default>
<track kind="captions" src="captions-es.vtt" srclang="es" label="Español">
<track kind="descriptions" src="descriptions-en.vtt" srclang="en" label="English descriptions">
```

| `kind` | Purpose |
|---|---|
| `captions` | Transcribed dialogue **plus** relevant non-speech audio info (e.g. "[door slams]") — intended for deaf/hard-of-hearing users, assumed to be watched with sound off |
| `subtitles` | Transcribed dialogue only, assuming the viewer can already hear other audio — for language translation, not accessibility |
| `descriptions` | Narrated descriptions of important visual content, for blind/low-vision users |
| `chapters` | Navigation markers for jumping to sections |

Captions are provided as `.vtt` (WebVTT) files — plain text files with timestamped cue blocks, not baked into the video itself, which means they can be toggled, styled, and translated independently of the video file.

## `<audio>` — the same model, no visual dimensions

```html
<audio controls preload="none">
  <source src="podcast-episode.mp3" type="audio/mpeg">
  <source src="podcast-episode.ogg" type="audio/ogg">
  <p>Your browser doesn't support the audio element. <a href="podcast-episode.mp3">Download the audio</a>.</p>
</audio>
```

`<audio>` shares the same `controls`/`preload`/multi-`<source>` model as `<video>` but has no `width`/`height`/`poster` (nothing visual to reserve space for beyond the native controls bar itself).

## Why native `<video controls>` beats a from-scratch custom player by default

Native controls give you accessible, keyboard-operable play/pause/seek/volume/fullscreen for free, correctly localized to the user's browser language, with zero extra code. A fully custom player (common when design wants a specific look) has to reimplement all of this manually with ARIA and keyboard handling to reach the same baseline — a real, non-trivial undertaking, which is why "do we actually need a custom player, or can native `controls` be restyled with CSS" is a legitimate question to ask before committing to the custom-build path.
