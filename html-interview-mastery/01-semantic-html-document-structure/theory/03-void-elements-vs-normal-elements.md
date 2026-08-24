# Void Elements vs. Normal Elements

## What a void element is

A **void element** is an element that can never have children and therefore has no closing tag — the element *is* the tag. Trying to nest content inside one is a parse error (or the content is silently ignored/moved).

**The full list of HTML void elements:**

```
area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr
```

That's it — this is a closed, memorizable list, not a general "self-closing" concept.

## Correct syntax

```html
<!-- Correct — no closing tag, no slash required in HTML (not XHTML) -->
<img src="cat.jpg" alt="A cat">
<br>
<input type="text" name="q">
<hr>
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">

<!-- Also valid in HTML (the trailing slash is allowed but optional and does nothing) -->
<img src="cat.jpg" alt="A cat" />
<br />
```

**Common misconception:** the trailing `/` (as in `<br />`) is often called "self-closing" and treated as required — it's a holdover from XHTML, where void elements *had* to be self-closed to be well-formed XML. In HTML5, the slash is entirely optional and has zero effect on parsing; `<br>` and `<br />` produce an identical DOM. It's purely a stylistic/lint-config choice (some teams enforce it via Prettier for visual consistency with JSX).

## What happens if you try to close a void element

```html
<br></br>  <!-- INVALID — browsers parse the closing </br> as a stray tag and typically ignore it -->
<img src="x.jpg"></img>  <!-- INVALID — the </img> is dropped -->
```

The browser's HTML parser has a fixed set of "no end tag" elements; it won't create a matching close, and validators (the W3C validator, `eslint-plugin-html`, etc.) will flag this as an error.

## Normal (non-void) elements always need explicit closing — even when "empty"

```html
<p></p>              <!-- correct, even with no content -->
<div class="spacer"></div>
<script src="app.js"></script>  <!-- NEVER self-close <script> — <script src="app.js" /> is invalid HTML and silently breaks in non-XHTML documents -->
```

`<script>` is a frequent trap: because it looks void-like when it only has a `src` attribute and no inline code, people try `<script src="app.js" />`. In HTML (not XML/XHTML), this is invalid — the parser expects a real `</script>` closing tag and, depending on what follows in the markup, can swallow subsequent content as if it were the script's body.

## Void vs. "replaced" elements — a related but different concept

Don't confuse "void" (a *syntax* category — can't have children) with "replaced element" (a *rendering* category from CSS — content is provided by an external resource, like `<img>`, `<video>`, `<iframe>`, `<canvas>`). Most void elements happen to also be replaced elements (`img`, `embed`), but they're orthogonal: `<input>` is void but only sometimes visually "replaced" (e.g. `type="image"`); `<iframe>` is a replaced element but is **not** void — it requires a closing `</iframe>` tag and can theoretically contain fallback content for old browsers.

## Quick comparison table

| | Void elements | Normal elements |
|---|---|---|
| Closing tag | Never (and it's an error to add one) | Always required, even if empty |
| Can have children | No | Yes (unless content model forbids it, e.g. `<img>`'s content model is still "nothing," but syntactically that's different from being void) |
| Example | `<img>`, `<br>`, `<input>`, `<meta>` | `<div>`, `<p>`, `<script>`, `<iframe>` |
| Trailing `/>` | Optional, no effect | Invalid in HTML for non-void tags (`<div />` does not close the div) |
