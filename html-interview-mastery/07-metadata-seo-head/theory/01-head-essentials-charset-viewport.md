# `<head>` Essentials: Charset and Viewport

Two meta tags are close to non-negotiable on every real page, and both have precise, frequently-misunderstood rules about placement and content.

## `<meta charset="UTF-8">`

```html
<head>
  <meta charset="UTF-8">
  <!-- everything else -->
</head>
```

- Declares the character encoding the browser should use to interpret the byte stream as text. UTF-8 is the universal default choice — it covers essentially every writing system and is required by the HTML Living Standard to be the encoding used if you're authoring new documents.
- **Must appear within the first 1024 bytes of the document.** The browser has to know the encoding before it can correctly parse any non-ASCII text, so if it appears too late (after enough preceding bytes), the browser may have already started parsing with a guessed/default encoding and can misinterpret earlier content — in practice, this means it should be the **very first thing** inside `<head>`, before anything else, including the `<title>`.
- Omitting it entirely risks the browser guessing the wrong encoding from content heuristics or HTTP headers, potentially garbling non-ASCII characters (accented letters, emoji, non-Latin scripts) — a classic "mojibake" bug.

## `<meta name="viewport">`

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

This single tag is what makes a page responsive on mobile at all. Without it, mobile browsers render the page at a desktop-width virtual viewport (historically ~980px) and then scale the whole thing down to fit the screen — producing tiny, unreadable text and requiring the user to pinch-zoom, regardless of how much responsive CSS (`@media` queries, fluid layouts) the page actually has.

| Directive | Meaning |
|---|---|
| `width=device-width` | Sets the viewport width to match the device's actual screen width (in CSS pixels), instead of the desktop-width default |
| `initial-scale=1` | Sets the initial zoom level to 1:1 — no automatic zoom-out on load |
| `maximum-scale=1` / `user-scalable=no` | **Avoid these** — they disable pinch-zoom entirely, a significant accessibility problem for users with low vision who rely on zooming; modern accessibility guidance strongly recommends never disabling user scaling |

**Key point for interviews:** responsive CSS media queries are entirely ineffective on mobile without the viewport meta tag — the browser's virtual-viewport scaling happens *before* CSS media queries are even evaluated against a meaningful width, so a page can have perfect responsive CSS and still look broken on a phone if this tag is missing.

## Recommended minimal `<head>` opening

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Title</title>
  <!-- everything else follows -->
</head>
```

`charset` first (encoding must be known before parsing proceeds), `viewport` early (affects initial layout/rendering), `title` next (used by browser tabs, bookmarks, and — as covered in the SEO theory file — search result snippets).
