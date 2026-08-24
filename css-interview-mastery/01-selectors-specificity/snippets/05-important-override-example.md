# Snippet: `!important` Overriding a Higher-Specificity Rule

```css
/* third-party stylesheet you can't edit, loaded first */
.widget-button {
  color: white;
  background: gray !important; /* vendor locked this down */
}

/* your override, higher specificity, loaded AFTER — still loses */
#app .widget-button {
  background: dodgerblue; /* (1,1,0), loaded later — normally would win, but not against !important */
}

/* the only way to win back: match or exceed with your own !important */
#app .widget-button {
  background: dodgerblue !important;
}
```

Reach for `!important` only as a deliberate, documented last resort against code you don't control — using it to win fights against your *own* team's CSS just escalates the next fight.
