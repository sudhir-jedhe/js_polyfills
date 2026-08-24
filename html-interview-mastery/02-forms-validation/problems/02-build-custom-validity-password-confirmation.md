# Problem: Build Password-Confirmation Validation with `setCustomValidity`

## Problem Statement

Build a "change password" form with a new-password field (min 8 chars, must contain at least one digit) and a confirm-password field. The confirm field must show a custom error if it doesn't match the new password, and that error must correctly clear once the user fixes it — regardless of which field they edit last.

## Constraints

- Use `setCustomValidity()` for the mismatch check — not just visual/CSS feedback.
- The "must contain a digit" rule should use `pattern`, not custom JS logic.
- The mismatch check must re-run correctly if the user edits the *first* password field after already filling in the confirmation.
- Submission must be fully blocked (no network call) while any field is invalid.

## Solution

```html
<form id="change-pw-form" novalidate>
  <label for="new-pw">New password</label>
  <input id="new-pw" type="password" required minlength="8"
         pattern="(?=.*\d).{8,}" title="At least 8 characters, including at least one digit">

  <label for="confirm-pw">Confirm new password</label>
  <input id="confirm-pw" type="password" required>

  <p id="form-error" role="alert" hidden></p>
  <button type="submit">Change Password</button>
</form>
```

```js
const form = document.getElementById('change-pw-form');
const newPw = document.getElementById('new-pw');
const confirmPw = document.getElementById('confirm-pw');
const formError = document.getElementById('form-error');

function validateMatch() {
  if (confirmPw.value !== newPw.value) {
    confirmPw.setCustomValidity('Passwords do not match.');
  } else {
    confirmPw.setCustomValidity(''); // clears once resolved — required, or the field stays stuck invalid
  }
}

// re-run on BOTH fields, so editing either one keeps the match check correct
newPw.addEventListener('input', validateMatch);
confirmPw.addEventListener('input', validateMatch);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  validateMatch(); // final safety check right before evaluating overall validity

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  formError.hidden = true;
  console.log('Submitting password change…');
  // fetch('/api/change-password', { method: 'POST', body: new FormData(form) });
});
```

**Why this satisfies the constraints:** `pattern="(?=.*\d).{8,}"` enforces "at least 8 characters and at least one digit" declaratively via regex lookahead, without any JS. `setCustomValidity()` handles the cross-field match rule that no native attribute can express, and both password fields' `input` listeners call the same `validateMatch()` function, so editing `new-pw` *after* `confirm-pw` was already filled in still re-evaluates correctly (the classic bug scenario). `novalidate` on the form plus a manual `submit` handler means every check funnels through one explicit path, and `form.checkValidity()` at the end verifies both the native constraints (`required`, `minlength`, `pattern`) and the custom one together before allowing the (stubbed) network call.
