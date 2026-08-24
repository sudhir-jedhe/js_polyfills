# Native HTML5 Validation Attributes

Browsers implement a full validation layer purely from HTML attributes — no JavaScript required for the common cases.

## The core attributes

| Attribute | Applies to | Effect |
|---|---|---|
| `required` | most input types, `select`, `textarea` | Field must have a value before the form submits |
| `pattern` | text-like inputs (`text`, `email`, `tel`, `search`, `url`, `password`) | Value must match the given regex (implicitly anchored — matched against the entire value) |
| `min` / `max` | `number`, `range`, `date`, `time`, `datetime-local`, `month`, `week` | Bounds on numeric/date value |
| `step` | `number`, `range`, `date`, `time` | Granularity of allowed values (e.g. `step="5"` on a number only allows multiples of 5 from the base) |
| `minlength` / `maxlength` | text-like inputs, `textarea` | Bounds on character count |
| `multiple` | `email`, `file` | Allows several comma-separated emails, or several selected files |

## Example

```html
<form>
  <label for="username">Username</label>
  <input id="username" name="username" type="text"
         required minlength="3" maxlength="20"
         pattern="[a-zA-Z0-9_]+"
         title="Letters, numbers, and underscores only, 3–20 characters">

  <label for="age">Age</label>
  <input id="age" name="age" type="number" min="13" max="120" step="1" required>

  <button type="submit">Sign Up</button>
</form>
```

If a field fails validation on submit, the browser blocks submission, focuses the first invalid field, and shows a native bubble with the `title` attribute's text (or a default browser message if `title` is absent) — entirely without JavaScript.

## The validation-state pseudo-classes

```css
input:required { border-left: 3px solid #888; }
input:invalid  { border-color: #d33; }
input:valid    { border-color: #2a2; }
input:invalid:not(:placeholder-shown) { border-color: #d33; } /* only show red AFTER user has typed something */
```

`:invalid` matches the instant a field's value doesn't satisfy its constraints — including on page load if `required` is set and the field starts empty. This is why `:invalid:not(:placeholder-shown)` (or `:user-invalid` in newer browsers) is the practical pattern: it avoids showing an angry red border before the user has even had a chance to type.

## `novalidate` and `formnovalidate`

```html
<!-- disables native validation for the ENTIRE form -->
<form novalidate>

<!-- disables native validation for just THIS submit button (e.g. a "Save Draft" action) -->
<button type="submit" formnovalidate>Save as Draft</button>
```

`formnovalidate` is the more surgical tool — useful when a form has multiple submit actions with different validation needs (e.g. "Save Draft" shouldn't require every field to be filled, but "Publish" should).

## What native validation does *not* do

- Cross-field validation (e.g. "password and confirm-password must match") — requires JS via `setCustomValidity()`.
- Async/server-side checks (e.g. "this username is already taken") — inherently requires a network round-trip.
- Complex conditional logic ("field B is required only if field A is 'Other'") — `required` is static; toggling it via JS based on other fields' values is the standard approach.
- Custom error message styling beyond what the browser's native validation bubble supports — many teams build custom error UI and rely on `reportValidity()`/`checkValidity()` plus the `ValidityState` object rather than the native bubble, precisely for this reason.
