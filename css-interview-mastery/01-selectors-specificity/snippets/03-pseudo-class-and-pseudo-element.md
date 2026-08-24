# Snippet: Pseudo-Classes and Pseudo-Elements

```css
/* pseudo-classes — an element STATE or structural position, no extra markup needed */
a:hover { text-decoration: underline; }
input:focus-visible { outline: 2px solid dodgerblue; }
li:first-child { margin-top: 0; }
li:nth-child(2n) { background: #f6f6f6; } /* every even item */
p:not(.lede) { color: #444; }

/* pseudo-elements — a generated sub-part of the element, use :: (double colon) per modern spec */
p::first-line { font-weight: 600; }
.tooltip::before {
  content: "\2192"; /* → */
  margin-right: 4px;
}
input::placeholder { color: #999; font-style: italic; }
li::marker { color: crimson; }
```

Browsers still accept a single colon (`:before`) for backwards compatibility with CSS2, but new code should always use `::` for pseudo-elements to distinguish them from pseudo-classes.
