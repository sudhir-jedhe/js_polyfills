*** copy 02-accessible-error-messaging.md ***

# Scenario: Accessible Error Messaging for Screen Reader Users

**Scenario:** Your team built custom (non-native-bubble) form error messages: red text appears below a field on invalid submit, using `novalidate` + manual `checkValidity()`. A screen reader user files feedback that they get no indication anything went wrong — they just hear the page go silent after pressing submit. How do you fix this?

**Diagnosis:** Visually appearing red text conveys nothing to a screen reader unless it's programmatically connected to the field (so it's read out when the field is focused) and/or placed in a live region (so it's announced the moment it appears, even without the user re-focusing anything). Custom validation UI has to manually reimplement everything the native validation bubble gave you for free — focus management and announcement — or accessibility regresses silently.

**Fix:**

```html
<label for="email">Email</label>
<input id="email" type="email" name="email" required
       aria-describedby="email-error" aria-invalid="false">
<p id="email-error" class="error-text" role="alert" hidden>
  Please enter a valid email address.
</p>
```

```js
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email');
  const errorEl = document.getElementById('email-error');

  if (!email.checkValidity()) {
    errorEl.hidden = false;
    email.setAttribute('aria-invalid', 'true');
    email.focus(); // move focus to the first invalid field, mirroring native reportValidity() behavior
  } else {
    errorEl.hidden = true;
    email.setAttribute('aria-invalid', 'false');
    // proceed with real submission…
  }
});
```

**Why this fixes it:**
- `aria-describedby="email-error"` permanently links the field to its error text, so when the user is focused on (or returns focus to) the field, the screen reader reads the label, the field, *and* the error text together.
- `role="alert"` makes the element an implicit assertive live region — the moment `hidden` is removed and the element becomes visible with text content, screen readers announce it immediately, without requiring the user to have focus on it at that exact moment.
- `email.focus()` after showing the error mirrors what the native `reportValidity()` bubble does automatically — moving focus to the first problem field is what lets a screen reader user immediately land somewhere actionable instead of having to hunt for what went wrong.
- `aria-invalid` gives screen readers an explicit state announcement ("email, invalid data") independent of the visible error text, which matters for users who navigate by form-field shortcuts rather than reading surrounding text.
