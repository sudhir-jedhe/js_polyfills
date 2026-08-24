# Output: `number` Input with `step` Mismatch

```html
<label for="qty">Quantity (sold in packs of 5)</label>
<input id="qty" type="number" name="qty" min="5" max="50" step="5" value="5">
```

**Question:** The user manually types `7` into the field (overriding the initial `value="5"`) and submits the form. Does validation block it? What about using the spinner arrows instead of typing?

**Answer:** Typing `7` directly **does** block submission — `step="5"` combined with `min="5"` means only `5, 10, 15, 20, …` are valid values, and `7` fails the `stepMismatch` constraint (`input.validity.stepMismatch` would be `true`). However, clicking the native spinner up/down arrows **never produces an invalid value in the first place** — the browser increments/decrements strictly by `step` starting from `min`, so the arrows can only ever land on `5, 10, 15, …`.

**Why:** `step` only constrains *validity*, not *what the user can type* — a `number` input's text entry is still free-form (any numeric string, including out-of-step values, can be typed and will parse as a valid *number*, just an invalid *form value* per the step constraint). This is a common gotcha: `type="number"` restricts the input to numeric characters, but does not restrict which numeric values pass full constraint validation — that's what `min`/`max`/`step` are for, checked only at validation time (on submit, or via `checkValidity()`/`reportValidity()`), not on every keystroke.
