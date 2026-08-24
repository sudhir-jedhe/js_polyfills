# Problem: Live Form Validation Styling with `:has()`

## Problem Statement

Build a signup form where each field group visually reflects the validity of its input in real time, purely with CSS — no JavaScript listeners for style toggling.

## Requirements

- A field group shows a red border once its input becomes invalid (but not before the user has interacted with it — don't flag empty required fields red on first paint).
- A field group shows a green border once its input becomes valid.
- The submit button becomes visually "enabled" only once every required field in the form is valid.
- No class toggling via JavaScript — state must be derived entirely from native validation pseudo-classes and `:has()`.

## Solution

```html
<form class="signup" novalidate>
  <div class="field">
    <label for="email">Email</label>
    <input id="email" type="email" required placeholder=" " />
  </div>
  <div class="field">
    <label for="password">Password</label>
    <input id="password" type="password" minlength="8" required placeholder=" " />
  </div>
  <button type="submit">Create account</button>
</form>
```

```css
.field {
  border: 2px solid #d1d5db;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.15s ease;
}

/* Only flag invalid AFTER interaction — :placeholder-shown means "still empty/untouched" */
.field:has(input:invalid:not(:placeholder-shown)) {
  border-color: crimson;
}

.field:has(input:valid:not(:placeholder-shown)) {
  border-color: seagreen;
}

/* Disable-looking submit button unless EVERY required field in the form is valid */
.signup button[type="submit"] {
  opacity: 0.5;
  pointer-events: none;
}

.signup:not(:has(input:invalid)) button[type="submit"] {
  opacity: 1;
  pointer-events: auto;
}
```

**Why this works:** `:placeholder-shown` combined with a non-empty `placeholder=" "` gives a CSS-only signal for "the user hasn't typed anything yet," which prevents the red state from flashing on an untouched required field. `:has(input:invalid)` on the `<form>` lets a single rule ask "does this form currently contain ANY invalid input?" — negating it with `:not()` produces "the whole form is currently valid," which is exactly the submit-button gating condition, all without a single JavaScript event listener. Native HTML5 validation attributes (`required`, `type="email"`, `minlength`) are what actually drive `:valid`/`:invalid` — `:has()` just exposes that state to ancestor selectors that couldn't previously react to it.

**Note:** this visually gates the button but doesn't prevent a form submission event on its own (`pointer-events: none` blocks clicks, but a real submit should still be guarded server-side and the form should not rely on `novalidate` + CSS alone for actual validation enforcement).
