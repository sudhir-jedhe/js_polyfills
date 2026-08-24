# Scenario: Password-Confirmation Field Stuck Permanently Invalid

**Scenario:** A signup form uses `setCustomValidity()` to enforce "password and confirm-password must match." QA reports a bug: once a user types a mismatched confirmation, even after correcting it to match, the form still refuses to submit and keeps showing "Passwords do not match" forever. What's the bug, and how do you fix it?

**Buggy code:**

```js
confirmPw.addEventListener('input', () => {
  if (confirmPw.value !== newPw.value) {
    confirmPw.setCustomValidity('Passwords do not match.');
  }
  // BUG: no else branch — never calls setCustomValidity('') when they DO match
});
```

**Diagnosis:** `setCustomValidity()` is sticky by design — once called with a non-empty string, the field is permanently marked invalid (`validity.customError = true`) regardless of any later changes to its value, *until* `setCustomValidity('')` is explicitly called to clear it. This code only ever sets the error and never clears it, so the very first mismatch permanently poisons the field for the rest of the session, even after the user fixes the typo.

**Fix:**

```js
function validateMatch() {
  if (confirmPw.value !== newPw.value) {
    confirmPw.setCustomValidity('Passwords do not match.');
  } else {
    confirmPw.setCustomValidity(''); // the required else branch — clears the custom error once resolved
  }
}

newPw.addEventListener('input', validateMatch); // also re-check when the FIRST password field changes
confirmPw.addEventListener('input', validateMatch);
```

**Why listening on `newPw` too matters:** if the bug fix only re-validated on `confirmPw`'s own input event, a user who types the confirm field correctly *first*, then goes back and edits the original password field, would end up with a stale, incorrectly-passing validation state (or vice versa, an incorrectly-stuck error) — both fields' input events need to re-run the same match check, since either one changing affects whether they match.

**General lesson:** any use of `setCustomValidity()` needs a corresponding "clear" path reachable from every event that could change the validity outcome — it's easy to write the "mark invalid" branch and forget the "mark valid again" branch, since the bug is invisible until someone actually tests the fix-after-error path.
