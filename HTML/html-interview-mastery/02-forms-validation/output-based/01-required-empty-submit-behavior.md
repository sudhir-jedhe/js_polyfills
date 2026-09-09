***  01-required-empty-submit-behavior.md ***

# Output: Submitting a Form with an Empty Required Field

```html
<form action="/subscribe" method="post">
  <label for="email">Email</label>
  <input id="email" type="email" name="email" required>
  <button type="submit">Subscribe</button>
</form>
```

**Question:** The user clicks "Subscribe" with the email field empty. What happens?

**Answer:** The form does **not** submit and no network request is made. The browser blocks submission, moves keyboard focus to the `email` field, and shows a native validation bubble ("Please fill out this field" or the browser's localized equivalent). The page does not navigate or reload.

**Why:** `required` participates in the browser's built-in constraint validation, which runs automatically at submit time for every form unless the form has `novalidate` or the specific submit button has `formnovalidate`. This happens entirely without JavaScript — no `submit` event listener is needed for this base behavior, which is exactly why native validation is worth using for simple cases instead of immediately reaching for a JS validation library.
