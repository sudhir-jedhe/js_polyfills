*** copy 02-newer-input-types.md ***

# Snippet: Newer Input Types

```html
<form>
  <label for="dob">Date of birth</label>
  <input id="dob" type="date" name="dob" max="2026-08-19">

  <label for="appt-time">Appointment time</label>
  <input id="appt-time" type="time" name="appt-time">

  <label for="phone">Phone number</label>
  <input id="phone" type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
         placeholder="555-123-4567">

  <label for="quantity">Quantity</label>
  <input id="quantity" type="number" name="quantity" min="1" max="10" step="1" value="1">

  <label for="volume">Volume</label>
  <input id="volume" type="range" name="volume" min="0" max="100" step="1" value="50">

  <label for="theme-color">Favorite color</label>
  <input id="theme-color" type="color" name="theme-color" value="#3366ff">

  <label for="site">Website</label>
  <input id="site" type="url" name="site" placeholder="https://example.com">
</form>
```

Note `type="tel"` has no built-in format validation (phone formats vary too much internationally) — the `pattern` attribute here adds the format constraint explicitly. `type="date"`'s value is always normalized to `YYYY-MM-DD` in JS/`FormData` regardless of the locale-specific display format the native picker shows the user.
