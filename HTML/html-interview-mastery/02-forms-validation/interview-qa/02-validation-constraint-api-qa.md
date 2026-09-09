***  02-validation-constraint-api-qa.md ***

# Interview Q&A — Validation & the Constraint Validation API

**Q: What's the difference between `checkValidity()` and `reportValidity()`?**
Both return a boolean and check the same constraints. `checkValidity()` does this silently — no UI shown. `reportValidity()` additionally shows the native validation bubble and moves focus to the field if invalid. Use `checkValidity()` for silent checks (e.g. enabling/disabling a submit button); use `reportValidity()` when you want the browser's built-in error UI to appear.

**Q: What does `setCustomValidity()` do, and what's the most common bug when using it?**
It manually marks a field invalid with a custom message, participating in the same native validation flow as built-in constraints. The most common bug is forgetting to call `setCustomValidity('')` once the condition that caused the error is no longer true — the field then stays permanently invalid even after the user fixes it, since custom validity doesn't auto-clear.

**Q: What is `ValidityState`, and name three of its flags.**
A read-only object (`input.validity`) with granular boolean flags describing exactly *why* a field is invalid: `valueMissing` (failed `required`), `patternMismatch` (failed `pattern`), `rangeOverflow`/`rangeUnderflow` (failed `max`/`min`), `typeMismatch` (e.g. malformed email/URL), `tooShort`/`tooLong` (failed `minlength`/`maxlength`), `stepMismatch` (failed `step`), and `customError` (from `setCustomValidity`). `.valid` is `true` only when every other flag is `false`.

**Q: How would you build fully custom error UI instead of relying on native validation bubbles?**
Add `novalidate` to the `<form>` (this disables the browser's *automatic* submit-time check and native bubble, but does not disable the Constraint Validation API itself), then manually call `checkValidity()`/`.validity` in a `submit` handler, `preventDefault()` if invalid, and render your own error markup — typically linked to the field via `aria-describedby` and marked with `aria-invalid="true"` for accessibility.

**Q: Does `pattern` validate an empty, non-required field?**
No — `pattern` (and `minlength`) only apply once the field has a non-empty value. An optional field with just a `pattern` and no `required` is considered valid while empty; the pattern only kicks in once the user actually types something.

**Q: Can native HTML validation handle cross-field rules like "end date must be after start date"?**
Not declaratively — there's no attribute for it. You implement it with JS: compare the two fields' values on an `input`/`change` handler and call `setCustomValidity()` on the relevant field (typically the "end date" field), clearing it once the condition is satisfied again.
