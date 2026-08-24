# Snippet: Combining Media Features (Range Syntax, Orientation, Preferences)

```css
/* Tablet band only, using modern range syntax */
@media (768px <= width <= 1023px) {
  .layout { grid-template-columns: repeat(2, 1fr); }
}

/* Landscape phones specifically (narrow width AND landscape orientation) */
@media (width < 768px) and (orientation: landscape) {
  .hero { min-height: 100dvh; padding-block: 12px; }
}

/* Respect the user's OS-level dark mode preference */
@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}

/* Respect the user's OS-level reduced-motion preference */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}

/* Coarse pointer (touch) vs fine pointer (mouse) — bigger tap targets on touch */
@media (pointer: coarse) {
  .button { min-height: 44px; padding-inline: 20px; }
}
```

Media features can be layered with `and` for precise targeting (tablet-band width *and* landscape), and features unrelated to size — `prefers-color-scheme`, `prefers-reduced-motion`, `pointer`, `hover` — let you respond to user preferences and input capabilities, not just viewport dimensions.
