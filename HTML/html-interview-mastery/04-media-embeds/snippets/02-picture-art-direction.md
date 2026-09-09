***  02-picture-art-direction.md ***

# Snippet: `<picture>` Art Direction

```html
<picture>
  <!-- narrow viewports: a tighter, vertically-cropped composition -->
  <source media="(max-width: 600px)" srcset="team-portrait-crop.jpg">
  <!-- medium viewports: a moderate crop -->
  <source media="(max-width: 1100px)" srcset="team-medium-crop.jpg">
  <!-- fallback / widest viewports: the full wide shot -->
  <img src="team-wide-shot.jpg" alt="The engineering team gathered around a whiteboard">
</picture>
```

At a phone width, `team-portrait-crop.jpg` (a genuinely different image, deliberately cropped tighter around the team's faces) loads instead of a naively scaled-down version of the wide shot — which at phone size would render the team as tiny, hard-to-see figures. Only one `<source>`'s condition ever "wins" (first match, top to bottom); the `<img>` fallback also supplies the `alt` text used regardless of which source actually loaded.
