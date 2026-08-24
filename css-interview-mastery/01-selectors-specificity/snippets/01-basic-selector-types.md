# Snippet: Basic Selector Types

```css
/* type (element) selector */
p { line-height: 1.5; }

/* class selector — reusable, the workhorse of component CSS */
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; }

/* ID selector — should be unique per page, high specificity, use sparingly */
#site-header { position: sticky; top: 0; }

/* universal selector — matches everything, zero specificity */
* { box-sizing: border-box; }

/* grouping — apply the same declarations to multiple selectors */
h1, h2, h3 { font-weight: 700; margin-bottom: 0.5em; }
```

```html
<h1>Title</h1>
<p id="site-header" class="badge">Hello</p>
```
