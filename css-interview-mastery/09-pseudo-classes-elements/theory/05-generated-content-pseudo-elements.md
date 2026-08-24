# `::before` / `::after` and the `content` Property

`::before` and `::after` insert a generated "box" as the first or last child of an element's content, styled with CSS and populated (usually) via the `content` property. They don't exist in the DOM — you can't `querySelector('::before')` — but they're fully paintable, sizable boxes in the render tree.

## Requires `content` to render

An element with no `content` value produces **nothing** — `::before`/`::after` are not rendered at all unless `content` is set (even `content: ""` counts):

```css
.tooltip::after {
  content: "";           /* empty string is enough to make the box exist */
  display: block;
  width: 8px;
  height: 8px;
  background: #333;
  transform: rotate(45deg);
}

.required::after {
  content: " *";          /* literal text */
  color: crimson;
}
```

## What `content` can hold

```css
content: "Some text";           /* literal string */
content: attr(data-label);      /* value of an HTML attribute on the element */
content: counter(list-item);    /* CSS counters, e.g. for custom numbered lists */
content: url(icon.svg);         /* an image, like <img> but non-replaceable in most respects */
content: "\201C";               /* Unicode escape — smart quote character */
content: none;                  /* explicitly suppresses the pseudo-element */
```

`attr()` is a common real-world use — labeling elements from data attributes without duplicating text in markup and CSS:

```css
.badge::before { content: attr(data-count) " items"; }
```
```html
<span class="badge" data-count="4"></span> <!-- renders "4 items" -->
```

## Common use cases

- Decorative icons (arrows, checkmarks, bullets) without extra markup
- Tooltips / speech-bubble triangles (a zero-size box rotated 45°)
- Clearfix hacks (`.clearfix::after { content: ""; display: table; clear: both; }`) — largely obsolete now that flexbox/grid don't have float-collapse issues, but still asked about
- Decorative quote marks around `<blockquote>` text
- Numbered/lettered custom counters for non-`<ol>` lists

## Limitations — these come up often in interviews

- **Not real DOM nodes.** They can't be selected with `document.querySelector`, can't receive focus, can't be form controls, and historically had inconsistent screen-reader support (modern screen readers usually announce `content` text, but it's not something to rely on for meaningful content — decorative use only).
- **Only one `::before` and one `::after` per element** — you cannot stack multiple generated boxes on the same element (though `::before` and `::after` on the same element are of course both allowed).
- **Can't be applied to *replaced* elements** like `<img>`, `<input>`, `<video>`, `<iframe>` — these have no "content" for the pseudo-element to attach around, so `img::before` does nothing in practice.
- **Not part of the accessibility tree's structured content** — never rely on generated content for information a screen-reader user *must* receive; use real markup for anything meaningful, and treat `::before`/`::after` as visual decoration only.
