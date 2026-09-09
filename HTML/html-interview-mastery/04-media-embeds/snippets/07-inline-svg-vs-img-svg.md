***  07-inline-svg-vs-img-svg.md ***

# Snippet: Inline SVG vs. `<img src="*.svg">`

```html
<!-- Inline: full CSS control over individual paths, supports hover/state-driven styling -->
<button class="like-btn" aria-pressed="false">
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path class="heart-outline" d="M12 21s-6.7-4.35-9.3-8.1C.8 9.8 2 6 5.6 6c2 0 3.4 1.2 4.4 2.7C11 7.2 12.4 6 14.4 6 18 6 19.2 9.8 17.3 12.9 18.7 4.35 12 21 12 21z"/>
  </svg>
  <span class="visually-hidden">Like this post</span>
</button>
```

```css
.heart-outline { fill: none; stroke: #666; stroke-width: 2; }
.like-btn[aria-pressed="true"] .heart-outline { fill: #e0245e; stroke: #e0245e; } /* only possible with inline SVG */
```

```html
<!-- External reference: simpler, cacheable, but internals are NOT stylable from page CSS -->
<img src="static-logo.svg" alt="Acme Inc." width="120" height="32">
```

The heart icon *must* be inline because its fill color needs to change based on a JS-toggled `aria-pressed` state — that kind of internal, state-driven styling is impossible once an SVG is referenced via `<img>` (its internal `<path>` becomes opaque to the page's CSS, exactly like the content of a cross-origin iframe). The logo, by contrast, never needs internal styling — it's always rendered identically — so `<img>` is the simpler, more cacheable, equally-appropriate choice there.
