*** copy 07-onclick-vs-onsubmit-preventdefault.md ***

# Output-Based: What happens if `handleSubmit` is attached to the button's `onClick` instead of the form's `onSubmit`, and the user submits by pressing Enter?

```jsx
function Form() {
  const [value, setValue] = React.useState('');
  function handleClick(e) {
    e.preventDefault();
    console.log('submitted:', value);
  }
  return (
    <form>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button type="submit" onClick={handleClick}>Save</button>
    </form>
  );
}
```

**Answer:** Clicking "Save" logs `submitted: <value>` correctly, but pressing Enter while focused in the input submits the form via the browser's default mechanism (full page reload/navigation), completely bypassing `handleClick` and its `preventDefault()`.

**Why:** `e.preventDefault()` inside a click handler only cancels the default action of *that specific click event* (the button's default submit behavior triggered by the click). It has no effect on a *different* triggering path — pressing Enter in a text field submits the form directly via its own `submit` event, which isn't intercepted because no `onSubmit` handler exists on the `<form>` itself. This is exactly why `onSubmit` on the form, not `onClick` on the button, is the correct place to handle submission.
