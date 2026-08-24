# Snippet: `setCustomValidity()` in Practice

```html
<form id="reset-form">
  <label for="new-pw">New password</label>
  <input id="new-pw" type="password" required minlength="8">

  <label for="confirm-pw">Confirm password</label>
  <input id="confirm-pw" type="password" required>

  <button type="submit">Reset Password</button>
</form>
```

```js
const newPw = document.getElementById('new-pw');
const confirmPw = document.getElementById('confirm-pw');

function checkMatch() {
  if (confirmPw.value && confirmPw.value !== newPw.value) {
    confirmPw.setCustomValidity('Passwords do not match.');
  } else {
    confirmPw.setCustomValidity(''); // always clear when the condition no longer holds
  }
}

newPw.addEventListener('input', checkMatch);
confirmPw.addEventListener('input', checkMatch);

document.getElementById('reset-form').addEventListener('submit', (e) => {
  checkMatch(); // re-verify right before submit too, in case fields were filled out of order
  if (!e.target.checkValidity()) {
    e.preventDefault();
    e.target.reportValidity(); // shows the native bubble on the first invalid field
  }
});
```

The `if (confirmPw.value && ...)` guard avoids flagging an error while the confirm field is still empty (that case is already handled by its own `required` attribute) — `setCustomValidity` is reserved specifically for the cross-field "they don't match" condition.
