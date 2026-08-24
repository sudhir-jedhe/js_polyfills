# Snippet: `:has()` for Form Validation Styling

```html
<div class="form-group">
  <label for="email">Email</label>
  <input id="email" type="email" required />
  <span class="error-msg">Please enter a valid email.</span>
</div>
```

```css
.form-group {
  border: 1px solid #ccc;
  padding: 0.75rem;
  border-radius: 6px;
}

.error-msg {
  display: none;
  color: crimson;
}

/* Style the PARENT based on the state of the child input — impossible before :has() */
.form-group:has(input:invalid:not(:placeholder-shown)) {
  border-color: crimson;
}

.form-group:has(input:invalid:not(:placeholder-shown)) .error-msg {
  display: block;
}

.form-group:has(input:valid) {
  border-color: seagreen;
}
```

`:not(:placeholder-shown)` avoids flagging the field as invalid before the user has typed anything (an empty `required` field is `:invalid` by default). This whole pattern previously required JavaScript to add/remove a class on the parent — `:has()` does it in pure CSS.
