***  03-accessibility-submission-qa.md ***

# Interview Q&A — Form Accessibility & Submission Mechanics

**Q: Why is a `placeholder` not an acceptable substitute for a `<label>`?**
It disappears the moment the user types (so there's no persistent reminder of the field's purpose), isn't reliably announced as a label replacement across all screen reader/browser combinations, and typically fails color-contrast requirements since placeholder text is conventionally styled lighter. `placeholder` should only hold a format hint (e.g. "MM/DD/YYYY"), never the field's actual name.

**Q: What's the accessibility benefit of `<fieldset>`/`<legend>` over individual `<label>`s on a radio group?**
Individual labels only describe each option ("Email," "Phone"), not the group's shared context. `<legend>` gives screen readers a group-level announcement ("Preferred contact method — Email, radio button") that a per-option label alone can't provide.

**Q: How do you make a dynamically-appearing custom error message actually get announced by a screen reader?**
Use `role="alert"` (or an `aria-live="assertive"`/`"polite"` region) on the error element so it's announced the moment its content appears, even without the user's focus being on it — and link it to the relevant field via `aria-describedby` so the error is also read out whenever the field itself receives focus.

**Q: When should you use `method="get"` vs. `method="post"`, from a security/UX standpoint?**
GET for anything idempotent, bookmarkable, and non-sensitive (search, filters) — data is visible in the URL/history/logs. POST for anything that mutates server state or includes sensitive data (login, account creation, payments) — data lives in the request body, not the URL, and isn't cached/bookmarked/resubmitted silently on refresh.

**Q: What breaks if you forget `enctype="multipart/form-data"` on a form with a file input?**
The form still submits, but the actual file content never reaches the server correctly — only the filename (or nothing) is sent as urlencoded text, since the default `enctype` can't carry binary data.

**Q: What's `autocomplete="new-password"` vs. `"current-password"` for, concretely?**
They tell password managers the *intent* of a password field: `new-password` (signup, password reset) signals "offer to generate/suggest a strong password," while `current-password` (login) signals "fill in the already-saved credential." Using the wrong one causes password managers to behave incorrectly — e.g. autofilling an old password into a "choose a new password" field.
