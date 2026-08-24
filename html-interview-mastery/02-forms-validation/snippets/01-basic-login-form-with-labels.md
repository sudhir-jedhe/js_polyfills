# Snippet: Basic Login Form with Proper Labels

```html
<form action="/login" method="post">
  <div>
    <label for="login-email">Email</label>
    <input id="login-email" name="email" type="email" autocomplete="email" required>
  </div>

  <div>
    <label for="login-password">Password</label>
    <input id="login-password" name="password" type="password"
           autocomplete="current-password" required minlength="8">
  </div>

  <button type="submit">Log In</button>
</form>
```

Every input has an explicit `for`/`id` label pairing, `type="email"`/`type="password"` for correct mobile keyboards and password-manager behavior, and `autocomplete="current-password"` (not `new-password`, since this is a login, not a signup) so password managers correctly offer to *fill* rather than *generate* a password.
