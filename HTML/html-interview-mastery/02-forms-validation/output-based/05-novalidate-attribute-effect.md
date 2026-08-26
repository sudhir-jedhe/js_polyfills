*** copy 05-novalidate-attribute-effect.md ***

# Output: The Effect of `novalidate`

```html
<form novalidate id="checkout-form">
  <label for="email">Email</label>
  <input id="email" type="email" name="email" required>
  <button type="submit">Place Order</button>
</form>
```

```js
document.getElementById('checkout-form').addEventListener('submit', (e) => {
  console.log(document.getElementById('email').checkValidity());
});
```

**Question:** The user submits with an empty email field. Does the browser block submission? What gets logged?

**Answer:** The browser does **not** block submission or show any native bubble — the form proceeds to submit (or, since there's no `action`, reloads the current page) despite the field being empty and `required`. The console still logs `false` — `checkValidity()` correctly reports the field as invalid.

**Why:** `novalidate` disables the browser's automatic constraint-checking *at submit time* — it does not remove the constraints themselves, and it does not disable the JavaScript Constraint Validation API. `input.checkValidity()`, `.validity`, and `.validationMessage` all still work and reflect the true state; `novalidate` only stops the browser from automatically calling the equivalent of `reportValidity()` for you on submit. This is exactly the mechanism teams use to build fully custom validation UI: keep `novalidate` on the form, then manually call `checkValidity()`/`reportValidity()` and render your own error messages instead of relying on native bubbles.
