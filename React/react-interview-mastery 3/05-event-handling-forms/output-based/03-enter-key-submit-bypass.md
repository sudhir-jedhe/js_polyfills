***  03-enter-key-submit-bypass.md ***

# Output-Based: What happens when the form is submitted by pressing Enter inside the text field?

```jsx
function SearchForm() {
  function handleClick() {
    console.log('searching...');
  }
  return (
    <form>
      <input type="text" />
      <button onClick={handleClick}>Search</button>
    </form>
  );
}
```

**Answer:** Pressing Enter inside the input triggers a full page reload/navigation, and `"searching..."` never logs from that action (it only logs if the button is explicitly clicked with a mouse/keyboard-activated click).

**Why:** The button has no explicit `type` attribute, so inside a `<form>` it defaults to `type="submit"`, meaning clicking it *does* also submit the form — but the handler here is attached to `onClick`, not `onSubmit`, and nothing calls `preventDefault()`. Pressing Enter in a text field submits the form directly (bypassing the button's `onClick` entirely) and triggers the browser's default full-page reload since there's no `onSubmit` handler to intercept it.
