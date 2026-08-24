# The Constraint Validation API and `setCustomValidity`

Beyond declarative attributes, every form control implements a JavaScript API for reading and controlling its validation state programmatically.

## Key methods and properties

| Member | What it does |
|---|---|
| `input.checkValidity()` | Returns `true`/`false`; fires an `invalid` event on the element if false, but does **not** show any UI |
| `input.reportValidity()` | Same check as `checkValidity()`, but **also shows the native validation bubble** and focuses the field if invalid |
| `input.validity` | A `ValidityState` object with granular boolean flags (see below) |
| `input.validationMessage` | The current human-readable validation message (native or custom) |
| `input.setCustomValidity(message)` | Manually marks the field invalid with a custom message — passing `""` clears any custom error and re-enables normal validation |
| `form.checkValidity()` / `form.reportValidity()` | Same, but checks every control in the form at once |

## `ValidityState` flags

```js
const input = document.querySelector('#age');
console.log(input.validity);
// {
//   valueMissing: false,     // true if `required` and empty
//   typeMismatch: false,     // true if type="email"/"url" value doesn't match the expected shape
//   patternMismatch: false,  // true if `pattern` doesn't match
//   rangeUnderflow: false,   // true if value < min
//   rangeOverflow: false,    // true if value > max
//   stepMismatch: false,     // true if value doesn't align to `step`
//   tooLong: false,          // true if value exceeds maxlength
//   tooShort: false,         // true if value is under minlength
//   customError: false,      // true if setCustomValidity() was called with a non-empty string
//   valid: true              // true only if ALL of the above are false
// }
```

This lets you build precise, per-condition error messages instead of relying on the browser's generic one:

```js
input.addEventListener('invalid', (e) => {
  e.preventDefault(); // suppress the native bubble so you can render your own UI
  if (input.validity.valueMissing) {
    showError(input, 'Age is required.');
  } else if (input.validity.rangeUnderflow) {
    showError(input, 'You must be at least 13 years old.');
  }
});
```

## `setCustomValidity()` — the standard tool for cross-field validation

Native attributes can't express "these two fields must match," but `setCustomValidity()` lets you plug custom logic into the same native validation flow (blocking submission, showing the bubble, focusing the field):

```html
<form id="signup">
  <input id="password" type="password" required minlength="8">
  <input id="confirm" type="password" required>
  <button type="submit">Create Account</button>
</form>
```

```js
const password = document.getElementById('password');
const confirm = document.getElementById('confirm');

function validateMatch() {
  if (confirm.value !== password.value) {
    confirm.setCustomValidity('Passwords do not match.');
  } else {
    confirm.setCustomValidity(''); // MUST clear it, or the field stays permanently invalid
  }
}

password.addEventListener('input', validateMatch);
confirm.addEventListener('input', validateMatch);
```

**The critical gotcha:** once `setCustomValidity()` is called with a non-empty string, the field is considered invalid *forever*, even if the underlying condition becomes true again later, unless you explicitly call `setCustomValidity('')` to clear it. Forgetting the clear-on-success branch is the most common bug with this API — the form becomes permanently unsubmittable even after the user fixes the mismatch.

## `checkValidity()` vs. `reportValidity()` — when to use which

- Use `checkValidity()` when you want to know the validity state silently (e.g. to conditionally enable a submit button) without interrupting the user.
- Use `reportValidity()` when you want the browser to actively show its native error UI and move focus — typically on a submit attempt, or as a fallback if you're not building fully custom error UI.
