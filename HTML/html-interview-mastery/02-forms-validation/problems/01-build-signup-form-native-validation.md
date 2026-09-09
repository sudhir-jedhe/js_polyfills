***  01-build-signup-form-native-validation.md ***

# Problem: Build a Signup Form with Full Native Validation

## Problem Statement

Build a signup form with: full name (required), email (required, valid email shape), username (required, 3-16 chars, letters/numbers/underscores only), password (required, min 8 chars), age (required, number, must be 13+), and a "I agree to the terms" checkbox (required). Use only native HTML5 validation — no JavaScript.

## Constraints

- Every field must have a properly associated `<label>`.
- Every constraint must be enforced via HTML attributes alone.
- Custom, human-readable messages should be provided where the browser's default message would be unclear (via `title`).
- Correct `autocomplete` values throughout.

## Solution

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign Up</title>
</head>
<body>
  <form action="/signup" method="post">
    <h1>Create Your Account</h1>

    <div>
      <label for="fullname">Full name</label>
      <input id="fullname" name="fullname" type="text" required autocomplete="name">
    </div>

    <div>
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required autocomplete="email">
    </div>

    <div>
      <label for="username">Username</label>
      <input id="username" name="username" type="text" required
             minlength="3" maxlength="16" pattern="[a-zA-Z0-9_]+"
             title="3-16 characters: letters, numbers, and underscores only"
             autocomplete="username">
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required
             minlength="8" title="At least 8 characters"
             autocomplete="new-password">
    </div>

    <div>
      <label for="age">Age</label>
      <input id="age" name="age" type="number" required min="13" max="120"
             title="You must be at least 13 years old">
    </div>

    <div>
      <label>
        <input type="checkbox" name="agree" required>
        I agree to the <a href="/terms">Terms of Service</a>
      </label>
    </div>

    <button type="submit">Create Account</button>
  </form>
</body>
</html>
```

**Why this satisfies the constraints:** each field's constraint is fully expressed declaratively — `required`, `type="email"` (shape check), `pattern` + `minlength`/`maxlength` (username rules), `minlength` (password length), `min`/`max` on a `type="number"` (age), and `required` on the checkbox (browsers do support `required` on checkboxes — it just means "must be checked," not "must have a value"). No `submit` handler or validation JS exists anywhere; the browser performs the entire check natively and blocks submission with a focused, messaged bubble on the first invalid field.
