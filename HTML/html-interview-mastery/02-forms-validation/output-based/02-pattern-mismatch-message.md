***  02-pattern-mismatch-message.md ***

# Output: `pattern` Mismatch and the `title` Attribute

```html
<form>
  <label for="zip">ZIP code</label>
  <input id="zip" type="text" name="zip" pattern="[0-9]{5}" title="Enter a 5-digit ZIP code">
  <button type="submit">Submit</button>
</form>
```

**Question:** The user types `"ABCDE"` and submits. What message does the browser show, and where does it come from?

**Answer:** The browser blocks submission and shows a validation bubble containing the text **"Enter a 5-digit ZIP code"** — taken directly from the `title` attribute. If `title` were omitted, the browser would fall back to a generic built-in message like "Please match the requested format."

**Why:** For `pattern` mismatches specifically (unlike `required`, which always uses a generic message), browsers use the element's `title` attribute as the custom validation message shown in the bubble, if present. This is the only native, JS-free way to customize a `pattern` validation message — for full control over the *content and styling* of validation messages beyond what `title` allows, you'd need `setCustomValidity()` and your own rendered error UI instead of relying on the native bubble.
