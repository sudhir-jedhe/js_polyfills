***  04-audio-element-example.md ***

# Snippet: `<audio>` Element

```html
<figure>
  <figcaption>Episode 42: Understanding the Event Loop</figcaption>
  <audio controls preload="none">
    <source src="episode-42.mp3" type="audio/mpeg">
    <source src="episode-42.ogg" type="audio/ogg">
    <p>
      Your browser doesn't support the audio element.
      <a href="episode-42.mp3">Download the MP3</a>.
    </p>
  </audio>
  <a href="episode-42-transcript.html">Read the full transcript</a>
</figure>
```

`preload="none"` is a sensible default for a podcast-style page listing many episodes — nothing downloads until the user actually presses play on one, avoiding wasted bandwidth on episodes that are never played. Providing a linked transcript alongside the player is the standard accessibility supplement for audio-only content — there's no `<track>` equivalent that makes sense for a pure audio player the way captions do for video, so a full-text transcript is the practical alternative for deaf/hard-of-hearing users.
