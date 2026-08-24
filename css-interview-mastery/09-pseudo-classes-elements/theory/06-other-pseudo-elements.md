# `::first-line`, `::first-letter`, `::placeholder`, `::selection`, `::marker`

Beyond `::before`/`::after`, these pseudo-elements target specific rendered fragments of real elements.

## `::first-line` and `::first-letter`

Target a text fragment that's determined by *layout*, not markup — the "first line" changes as the viewport resizes.

```css
p::first-line {
  font-weight: bold;
  color: #333;
}

p::first-letter {
  font-size: 3em;
  float: left;
  line-height: 0.8;
  padding-right: 4px;
  /* classic "drop cap" effect */
}
```

Only a limited set of properties apply to `::first-line` (mostly font, color, background, and text properties — no `width`/`height`/margins, since it's not a real box you can size). `::first-letter` supports a slightly wider set including `float`, since drop caps are its primary use case.

## `::placeholder`

Styles the placeholder text of an `<input>`/`<textarea>`.

```css
input::placeholder {
  color: #999;
  opacity: 1; /* Firefox applies a lower default opacity — reset it explicitly for consistency */
  font-style: italic;
}
```

Note: `::placeholder` styling does **not** affect the actual entered value, and browsers restrict which properties can be set (mostly text/color-related — you cannot, for example, reposition it independently of the input's own box).

## `::selection`

Styles the text a user has highlighted/selected with the mouse or keyboard.

```css
::selection {
  background: #ffe066;
  color: #111;
}
```

Only a small property subset applies (`color`, `background-color`, `text-shadow`, and a couple others) — layout-affecting properties are ignored for security/UX consistency reasons (a page shouldn't be able to make selected text bigger and break layout).

## `::marker`

Styles the marker box (bullet or number) of a list item or `<summary>`.

```css
li::marker {
  color: crimson;
  font-weight: bold;
}

li::marker { content: "→ "; } /* can even replace the marker glyph entirely */
```

Before `::marker`, styling list bullets required hacks like `list-style: none` plus manual `::before` bullets. `::marker` is the standards-based way to restyle native markers directly, including for `<li>` and `<summary>` elements.

## Quick reference

| Pseudo-element | Targets | Key limitation |
|---|---|---|
| `::first-line` | First rendered line of a block | Very limited property set, reflows with viewport |
| `::first-letter` | First letter of a block | Slightly wider property set (supports `float`) |
| `::placeholder` | Placeholder text in form fields | Text/color styling only, browser-restricted property list |
| `::selection` | User's current text selection | Only a handful of visual properties allowed |
| `::marker` | List item / `<summary>` marker | Only a subset of font/color properties, not full box styling |
