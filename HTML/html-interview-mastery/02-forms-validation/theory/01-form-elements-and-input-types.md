***  01-form-elements-and-input-types.md ***

# Form Elements and Input Types

## The core form elements

| Element | Purpose |
|---|---|
| `<form>` | The container that groups controls and defines submission behavior (`action`, `method`, `enctype`) |
| `<input>` | The workhorse control — its behavior is entirely driven by the `type` attribute |
| `<select>` / `<option>` / `<optgroup>` | A dropdown/listbox of choices, optionally grouped |
| `<textarea>` | Multi-line free text |
| `<button>` | A clickable control — defaults to `type="submit"` **inside a `<form>`**, which is a common bug source |
| `<label>` | Associates a text description with a control — required for accessibility, not optional polish |
| `<fieldset>` / `<legend>` | Groups related controls with a caption (e.g. a radio button group) |
| `<datalist>` | Provides an `<input>` with a list of suggested (not enforced) autocomplete options |
| `<output>` | Represents the result of a calculation, associated with the inputs that produced it |

## `<button>`'s default type is a classic gotcha

```html
<form>
  <input type="text" name="q">
  <button>Search</button>          <!-- implicitly type="submit" -->
  <button onclick="doThing()">Do Thing</button>  <!-- ALSO implicitly type="submit"! -->
</form>
```

Any `<button>` inside a `<form>` without an explicit `type` defaults to `type="submit"` — including one you only meant as a generic click handler trigger. This causes the classic bug where clicking a "helper" button unexpectedly submits/reloads the page. Always be explicit: `type="button"` for non-submitting buttons, `type="submit"` for the real submit action, `type="reset"` for form resets (rarely used today).

## Input types — the full practical set

| `type` | Purpose | Native benefit |
|---|---|---|
| `text` | Generic single-line text | none beyond baseline |
| `email` | Email address | Mobile keyboards show `@`; native validation checks basic email shape |
| `password` | Obscured text | Browser offers to save/generate credentials |
| `tel` | Phone number | Mobile numeric-symbol keyboard; **no format validation** (phone formats vary too much globally, so use `pattern` if you need it) |
| `number` | Numeric input | Spinner UI; enforces numeric value; supports `min`/`max`/`step` |
| `range` | Numeric input via slider | Visual slider UI, same `min`/`max`/`step` support, value is still a string in JS |
| `date` | Calendar date | Native date picker UI, value format always `YYYY-MM-DD` regardless of locale display |
| `time` | Time of day | Native time picker |
| `datetime-local` | Date + time, no timezone | Native combined picker |
| `month` / `week` | Coarser date granularity | Native pickers for month/week selection |
| `color` | Color value | Native color picker, value always a `#rrggbb` hex string |
| `url` | Web address | Mobile keyboard with `/` and `.`; native validation checks URL shape |
| `search` | Search query | Some browsers show a clear ("x") button; semantically distinct from `text` |
| `checkbox` | Boolean toggle, or one-of-many when grouped by `name` | — |
| `radio` | Exactly one choice from a group sharing the same `name` | — |
| `file` | File upload | Pairs with `accept` to filter file picker, `multiple` for several files |
| `hidden` | Data submitted but not rendered/interactive | Common for CSRF tokens, IDs |

## Why native input types beat plain `text` + JS

```html
<!-- Weak: no semantic hint, no native validation, no mobile keyboard optimization -->
<input type="text" name="age">

<!-- Strong: numeric keyboard on mobile, spinner UI, native min/max validation, semantic meaning -->
<input type="number" name="age" min="0" max="120">
```

Choosing the right `type` is close to free — it costs nothing extra to write `type="email"` instead of `type="text"`, and you immediately gain mobile keyboard optimization, baseline validation, and — critically — better default accessibility, since assistive technology can announce "email edit text" instead of a generic "edit text" with no hint about expected content.

## `<select>` vs. a styled `<div>`-based custom dropdown

A native `<select>` gives you free keyboard navigation (arrow keys, type-ahead-by-letter), free mobile OS-native picker UI, and free screen reader support — all without a line of JS. Custom-built dropdowns (common when design wants full visual control) have to reimplement all of that manually with ARIA (`role="listbox"`, `role="option"`, focus management) to reach the same baseline — see the accessibility-aria topic's accessible custom dropdown problem for the full implementation.
