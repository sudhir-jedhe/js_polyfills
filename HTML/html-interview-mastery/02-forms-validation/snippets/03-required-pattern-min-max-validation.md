***  03-required-pattern-min-max-validation.md ***

# Snippet: `required`, `pattern`, `min`/`max` Validation

```html
<form>
  <label for="username">Username</label>
  <input id="username" type="text" name="username"
         required minlength="3" maxlength="16"
         pattern="[a-zA-Z0-9_]+"
         title="3-16 characters: letters, numbers, underscores only">

  <label for="age">Age</label>
  <input id="age" type="number" name="age" required min="13" max="120">

  <label for="promo">Promo code (optional)</label>
  <input id="promo" type="text" name="promo" pattern="[A-Z]{4}-[0-9]{4}"
         title="Format: ABCD-1234">

  <button type="submit">Submit</button>
</form>
```

```css
/* only flag red AFTER the user has interacted, not on initial page load */
input:invalid:not(:placeholder-shown) { border-color: #d33; outline-color: #d33; }
input:valid:not(:placeholder-shown)   { border-color: #2a2; }
```

`promo` has no `required` but still enforces `pattern` — an *empty* value skips pattern validation entirely (an optional field with a pattern only validates the pattern once something is actually typed), which is why `pattern` alone doesn't imply required.
