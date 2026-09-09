***  07-autocomplete-attributes.md ***

# Snippet: `autocomplete` Attribute Values

```html
<form autocomplete="on">
  <label for="fname">First name</label>
  <input id="fname" name="fname" autocomplete="given-name">

  <label for="lname">Last name</label>
  <input id="lname" name="lname" autocomplete="family-name">

  <label for="addr1">Street address</label>
  <input id="addr1" name="addr1" autocomplete="address-line1">

  <label for="city">City</label>
  <input id="city" name="city" autocomplete="address-level2">

  <label for="zip">Postal code</label>
  <input id="zip" name="zip" autocomplete="postal-code">

  <label for="cc-num">Card number</label>
  <input id="cc-num" name="cc-num" inputmode="numeric" autocomplete="cc-number">

  <label for="cc-exp">Expiration</label>
  <input id="cc-exp" name="cc-exp" autocomplete="cc-exp" placeholder="MM/YY">

  <label for="new-pw">New password</label>
  <input id="new-pw" type="password" autocomplete="new-password">
</form>
```

`autocomplete="new-password"` vs. `"current-password"` is the single highest-impact distinction: `new-password` signals to password managers "offer to generate a strong password here," while `current-password` (used on login forms) signals "fill in the already-saved one." Using the wrong one on a signup form causes the password manager to autofill the *old* saved password instead of suggesting a new strong one.
