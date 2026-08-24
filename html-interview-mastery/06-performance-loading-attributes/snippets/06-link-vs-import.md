# Snippet: `<link>` (Parallel) vs. `@import` (Sequential)

```html
<!-- Discovered instantly by the preload scanner; a.css and b.css fetch IN PARALLEL -->
<link rel="stylesheet" href="a.css">
<link rel="stylesheet" href="b.css">
```

```css
/* main.css — the browser must fetch and start parsing THIS file first */
@import url('a.css');
@import url('b.css');
/* a.css and b.css can't even begin fetching until main.css itself has arrived and
   been parsed far enough to find these @import rules — a sequential dependency
   the <link> version above never has */
```

```html
<!-- If main.css is loaded this way instead, the @import chain inside it adds a full
     extra round trip to the critical rendering path compared to using two <link> tags -->
<link rel="stylesheet" href="main.css">
```
